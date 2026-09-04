import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { IResource, ResourceModel } from "../../../models/resource.model";
import { BaseRepository } from "../common/base.repository";
import { IResourceRepository } from "../../interfaces/public/IResourceRepository";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import {
  IResourceListItemProjection,
  IResourceListItemProjectionWithCursor,
} from "../../../types/public/resource/resource-list-item-projection";

import { IResourceDetailsProjection } from "../../../types/public/resource/resource-details-projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

const RESOURCE_DETAILS_PROJECTION = {
  _id: 0,
  resourceId: "$_id",
  title: 1,
  description: 1,
  type: 1,
  category: 1,
  content: 1,
  fileUrl: 1,
  thumbnailUrl: 1,
  status: 1,
  publishedAt: 1,
  isDownloadable: 1,
  viewCount: 1,
  likeCount: 1,
  bookmarkCount: 1,
  commentCount: 1,
  createdAt: 1,
  updatedAt: 1,
};

@injectable()
export class ResourceRepository
  extends BaseRepository<IResource>
  implements IResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  async findPublicResources(
    query: PublicResourceListQueryDTO,
  ): Promise<CursorPaginationResult<IResourceListItemProjection>> {
    const {
      limit = 12,
      cursor,
      search,
      type,
      category,
      sortBy = "latest",
    } = query;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: "published",
        },
      },
    ];

    const searchText = search?.trim();

    if (searchText) {
      pipeline.push({
        $match: {
          $text: {
            $search: searchText,
          },
        },
      });
    }

    if (type) {
      pipeline.push({
        $match: {
          type,
        },
      });
    }

    if (category) {
      pipeline.push({
        $match: {
          category,
        },
      });
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
            {
              [sortField]: {
                [comparisonOperator]: cursorValue,
              },
            },
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
      {
        $sort: sort,
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,

          resourceId: {
            $toString: "$_id",
          },

          title: 1,
          description: 1,
          type: 1,
          thumbnailUrl: 1,
          category: 1,
          isDownloadable: 1,

          viewCount: 1,
          likeCount: 1,
          bookmarkCount: 1,
          shareCount: 1,
          commentCount: 1,

          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,

          cursorId: "$_id",

          cursorValue:
            sortField === "title"
              ? "$title"
              : sortField === "viewCount"
                ? "$viewCount"
                : sortField === "downloadCount"
                  ? "$downloadCount"
                  : `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<IResourceListItemProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      nextCursor = encodeCursor({
        id: lastItem.cursorId.toString(),
        value: lastItem.cursorValue,
      });
    }

    const resourceItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: resourceItems,
      nextCursor,
      hasMore,
    };
  }

  async findPublicResourceDetails(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceDetailsProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const result = await this._model.aggregate<IResourceDetailsProjection>([
      {
        $match: {
          _id: resourceObjectId,
          status: "published",
        },
      },
      {
        $project: RESOURCE_DETAILS_PROJECTION,
      },
    ]);

    return result[0] ?? null;
  }

  async incrementViewCount(resourceId: string | Types.ObjectId): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          viewCount: 1,
        },
      },
    );
  }

  async incrementLikeCount(resourceId: string | Types.ObjectId): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          likeCount: 1,
        },
      },
    );
  }

  async decrementLikeCount(resourceId: string | Types.ObjectId): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        likeCount: { $gt: 0 },
      },
      {
        $inc: {
          likeCount: -1,
        },
      },
    );
  }

  async incrementBookmarkCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          bookmarkCount: 1,
        },
      },
    );
  }

  async decrementBookmarkCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        bookmarkCount: { $gt: 0 },
      },
      {
        $inc: {
          bookmarkCount: -1,
        },
      },
    );
  }

  async incrementCommentCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          commentCount: 1,
        },
      },
    );
  }

  async decrementCommentCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
        commentCount: { $gt: 0 },
      },
      {
        $inc: {
          commentCount: -1,
        },
      },
    );
  }
}
