import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { IResource, ResourceModel } from "../../../models/resource.model";
import { ResourceLikeModel } from "../../../models/resourceLike.model";
import { ResourceViewModel } from "../../../models/resourceView.model";
import { BaseRepository } from "../../implements/common/base.repository";
import { INutriResourceRepository } from "../../interfaces/nutritionist/INutriResourceRepository";
import {
  GetNutriResourcesQueryDTO,
  NutriResourceSortBy,
} from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  INutriResourceProjection,
  INutriResourceListProjectionWithCursor,
} from "../../../types/nutritionist/resource/nutri-resource.projection";

const RESOURCE_PROJECTION = {
  _id: 0,
  resourceId: "$_id",
  title: 1,
  description: 1,
  type: 1,
  category: 1,
  content: 1,
  fileUrl: 1,
  status: 1,
  publishedAt: 1,
  viewCount: 1,
  likeCount: 1,
  commentCount: 1,
  isLikedByMe: 1,
  isViewedByMe: 1,
  createdAt: 1,
  updatedAt: 1,
};

@injectable()
export class NutriResourceRepository
  extends BaseRepository<IResource>
  implements INutriResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  async findResources(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriResourcesQueryDTO,
  ): Promise<CursorPaginationResult<INutriResourceProjection>> {
    const {
      search,
      status,
      type,
      category,
      sortBy = NutriResourceSortBy.LATEST,
      cursor,
      limit = 10,
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          createdBy: nutritionistObjectId,
        },
      },
    ];

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: escapedSearch, $options: "i" } },
            { description: { $regex: escapedSearch, $options: "i" } },
          ],
        },
      });
    }

    if (status) {
      pipeline.push({ $match: { status } });
    }

    if (type) {
      pipeline.push({ $match: { type } });
    }

    if (category) {
      pipeline.push({ $match: { category } });
    }

    let sortStage: Record<string, 1 | -1>;

    switch (sortBy) {
      case NutriResourceSortBy.OLDEST:
        sortStage = { createdAt: 1, _id: 1 };
        break;

      case NutriResourceSortBy.TITLE_ASC:
        sortStage = { title: 1, _id: 1 };
        break;

      case NutriResourceSortBy.TITLE_DESC:
        sortStage = { title: -1, _id: -1 };
        break;

      case NutriResourceSortBy.MOST_VIEWED:
        sortStage = { viewCount: -1, _id: -1 };
        break;

      case NutriResourceSortBy.LATEST:
      default:
        sortStage = { createdAt: -1, _id: -1 };
        break;
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      const sortField = Object.keys(sortStage)[0];
      const sortDirection = sortStage[sortField];

      if (!sortField) {
        throw new Error("Unable to determine the resource cursor sort field.");
      }

      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [comparisonOperator]: cursorData.value,
              },
            },
            {
              [sortField]: cursorData.value,
              _id: {
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: sortStage },
      { $limit: limit + 1 },
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
                    { $eq: ["$userId", nutritionistObjectId] },
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
                    { $eq: ["$userId", nutritionistObjectId] },
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
      {
        $project: {
          ...RESOURCE_PROJECTION,
          cursorId: "$_id",
          cursorValue:
            sortBy === NutriResourceSortBy.TITLE_ASC ||
            sortBy === NutriResourceSortBy.TITLE_DESC
              ? "$title"
              : sortBy === NutriResourceSortBy.MOST_VIEWED
                ? "$viewCount"
                : "$createdAt",
        },
      },
    );

    const result =
      await this._model.aggregate<INutriResourceListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            value: lastItem.cursorValue,
            id: lastItem.cursorId.toString(),
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

  async findResourceDetails(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: resourceObjectId,
          createdBy: nutritionistObjectId,
        },
      },
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
                    { $eq: ["$userId", nutritionistObjectId] },
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
                    { $eq: ["$userId", nutritionistObjectId] },
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
      {
        $project: RESOURCE_PROJECTION,
      },
    ];

    const result =
      await this._model.aggregate<INutriResourceProjection>(pipeline);

    return result[0] ?? null;
  }
}
