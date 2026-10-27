import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { IResource, ResourceModel } from "../../../models/resource.model";
import { UserModel } from "../../../models/user.model";
import { ResourceLikeModel } from "../../../models/resourceLike.model";
import { ResourceViewModel } from "../../../models/resourceView.model";

import { BaseRepository } from "../common/base.repository";
import { IPublicResourceRepository } from "../../interfaces/public/IPublicResourceRepository";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import {
  IResourceProjection,
  IResourceProjectionWithCursor,
} from "../../../types/public/resource/public-resource.projection";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

const RESOURCE_PROJECTION = {
  _id: 0,
  resourceId: { $toString: "$_id" },
  title: 1,
  description: 1,
  type: 1,
  category: 1,
  content: 1,
  fileUrl: 1,
  status: 1,
  publishedAt: 1,
  isDownloadable: 1,
  viewCount: 1,
  likeCount: 1,
  commentCount: 1,
  shareCount: 1,
  downloadCount: 1,
  isLikedByMe: 1,
  isViewedByMe: 1,
  createdBy: {
    userId: "$createdBy",
    fullName: "$creatorFullName",
  },
  createdAt: 1,
  updatedAt: 1,
};

@injectable()
export class PublicResourceRepository
  extends BaseRepository<IResource>
  implements IPublicResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  private buildUserStateStages(
    userId?: string | Types.ObjectId,
  ): PipelineStage[] {
    if (!userId) {
      return [
        {
          $addFields: {
            isLikedByMe: false,
            isViewedByMe: false,
          },
        },
      ];
    }

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    return [
      {
        $lookup: {
          from: ResourceLikeModel.collection.name,
          let: { resourceId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$resourceId", "$$resourceId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "likesByMe",
        },
      },
      {
        $lookup: {
          from: ResourceViewModel.collection.name,
          let: { resourceId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$resourceId", "$$resourceId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "viewsByMe",
        },
      },
      {
        $addFields: {
          isLikedByMe: { $gt: [{ $size: "$likesByMe" }, 0] },
          isViewedByMe: { $gt: [{ $size: "$viewsByMe" }, 0] },
        },
      },
    ];
  }

  private buildCreatorStages(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "createdBy",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          as: "creator",
        },
      },
      {
        $addFields: {
          creatorFullName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: [{ $arrayElemAt: ["$creator.firstName", 0] }, ""],
                  },
                  " ",
                  {
                    $ifNull: [{ $arrayElemAt: ["$creator.lastName", 0] }, ""],
                  },
                ],
              },
            },
          },
        },
      },
    ];
  }

  async findPublicResources(
    query: PublicResourceListQueryDTO,
    userId?: string | Types.ObjectId,
  ): Promise<CursorPaginationResult<IResourceProjection>> {
    const {
      limit = 12,
      cursor,
      search,
      type,
      category,
      sortBy = "latest",
    } = query;

    const pipeline: PipelineStage[] = [{ $match: { status: "published" } }];

    const searchText = search?.trim();

    if (searchText) {
      pipeline.push({
        $match: {
          $text: { $search: searchText },
        },
      });
    }

    if (type) {
      pipeline.push({ $match: { type } });
    }

    if (category) {
      pipeline.push({ $match: { category } });
    }

    let sortField: string;
    let sortDirection: 1 | -1;

    switch (sortBy) {
      case "oldest":
        sortField = "publishedAt";
        sortDirection = 1;
        break;
      case "title_asc":
        sortField = "title";
        sortDirection = 1;
        break;
      case "title_desc":
        sortField = "title";
        sortDirection = -1;
        break;
      case "most_viewed":
        sortField = "viewCount";
        sortDirection = -1;
        break;
      case "latest":
      default:
        sortField = "publishedAt";
        sortDirection = -1;
        break;
    }

    const sort: Record<string, 1 | -1> = {
      [sortField]: sortDirection,
      _id: sortDirection,
    };

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (sortField === "publishedAt" || sortField === "createdAt") {
        cursorValue = new Date(cursorData.value);
      }

      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

      pipeline.push({
        $match: {
          $or: [
            { [sortField]: { [comparisonOperator]: cursorValue } },
            {
              [sortField]: cursorValue,
              _id: {
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: sort },
      { $limit: limit + 1 },
      ...this.buildCreatorStages(),
      ...this.buildUserStateStages(userId),
      {
        $project: {
          ...RESOURCE_PROJECTION,
          cursorId: "$_id",
          cursorValue:
            sortField === "title"
              ? "$title"
              : sortField === "viewCount"
                ? "$viewCount"
                : `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<IResourceProjectionWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue,
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }

  async findPublicResourceDetails(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IResourceProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: resourceObjectId,
          status: "published",
        },
      },
      ...this.buildCreatorStages(),
      ...this.buildUserStateStages(userId),
      { $project: RESOURCE_PROJECTION },
    ];

    const result = await this._model.aggregate<IResourceProjection>(pipeline);

    return result[0] ?? null;
  }
}
