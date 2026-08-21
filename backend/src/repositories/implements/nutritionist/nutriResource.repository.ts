import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import {
  IResource,
  ResourceStatus,
  ResourceModel,
} from "../../../models/resource.model";
import { BaseRepository } from "../../implements/common/base.repository";
import { INutriResourceRepository } from "../../interfaces/nutritionist/INutriResourceRepository";
import {
  GetNutriResourcesQueryDTO,
  NutriResourceSortBy,
} from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  INutriResourceListProjection,
  INutriResourceListProjectionWithCursor,
} from "../../../types/nutritionist/resource/nutri-resource-list.projection";
import { INutriResourceDetailsProjection } from "../../../types/nutritionist/resource/nutri-resource-details.projection";

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
  ): Promise<CursorPaginationResult<INutriResourceListProjection>> {
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
    const cursorData = decodeCursor(cursor);
    const pipeline: PipelineStage[] = [
      {
        $match: {
          createdBy: nutritionistObjectId,
        },
      },
    ];
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: search,
                $options: "i",
              },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (status) {
      pipeline.push({
        $match: {
          status,
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

    let sortStage: Record<string, 1 | -1>;

    switch (sortBy) {
      case NutriResourceSortBy.OLDEST:
        sortStage = {
          createdAt: 1,
          _id: 1,
        };
        break;

      case NutriResourceSortBy.TITLE_ASC:
        sortStage = {
          title: 1,
          _id: 1,
        };
        break;

      case NutriResourceSortBy.TITLE_DESC:
        sortStage = {
          title: -1,
          _id: -1,
        };
        break;

      case NutriResourceSortBy.MOST_VIEWED:
        sortStage = {
          viewCount: -1,
          _id: -1,
        };
        break;

      case NutriResourceSortBy.MOST_DOWNLOADED:
        sortStage = {
          downloadCount: -1,
          _id: -1,
        };
        break;

      case NutriResourceSortBy.LATEST:
      default:
        sortStage = {
          createdAt: -1,
          _id: -1,
        };
        break;
    }

    if (cursorData) {
      const sortField = Object.keys(sortStage)[0];
      const sortDirection = sortStage[sortField];

      const comparison =
        sortDirection === -1
          ? {
              $or: [
                {
                  [sortField]: {
                    $lt: cursorData.value,
                  },
                },
                {
                  [sortField]: cursorData.value,
                  _id: {
                    $lt: new Types.ObjectId(cursorData.id),
                  },
                },
              ],
            }
          : {
              $or: [
                {
                  [sortField]: {
                    $gt: cursorData.value,
                  },
                },
                {
                  [sortField]: cursorData.value,
                  _id: {
                    $gt: new Types.ObjectId(cursorData.id),
                  },
                },
              ],
            };

      pipeline.push({
        $match: comparison,
      });
    }

    pipeline.push({
      $sort: sortStage,
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        resourceId: "$_id",

        title: 1,
        description: 1,
        type: 1,

        thumbnailUrl: 1,

        category: 1,

        status: 1,

        isDownloadable: 1,

        viewCount: 1,
        downloadCount: 1,
        likeCount: 1,
        bookmarkCount: 1,
        shareCount: 1,
        commentCount: 1,

        createdAt: 1,
        updatedAt: 1,

        cursorId: "$_id",

        cursorValue:
          sortBy === NutriResourceSortBy.TITLE_ASC ||
          sortBy === NutriResourceSortBy.TITLE_DESC
            ? "$title"
            : sortBy === NutriResourceSortBy.MOST_VIEWED
              ? "$viewCount"
              : sortBy === NutriResourceSortBy.MOST_DOWNLOADED
                ? "$downloadCount"
                : "$createdAt",
      },
    });

    const result =
      await ResourceModel.aggregate<INutriResourceListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor({
            value: items[items.length - 1].cursorValue,
            id: items[items.length - 1].cursorId.toString(),
          })
        : null;

    const browseItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: browseItems,
      nextCursor,
      hasMore,
    };
  }

  async findResourceDetails(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceDetailsProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const result = await this._model.aggregate<INutriResourceDetailsProjection>(
      [
        {
          $match: {
            _id: resourceObjectId,
            createdBy: nutritionistObjectId,
          },
        },
        {
          $project: {
            _id: 0,

            resourceId: "$_id",

            title: 1,
            description: 1,
            type: 1,
            content: 1,
            fileUrl: 1,
            externalUrl: 1,
            thumbnailUrl: 1,
            category: 1,
            status: 1,
            publishedAt: 1,
            isDownloadable: 1,

            viewCount: 1,
            downloadCount: 1,
            likeCount: 1,
            bookmarkCount: 1,
            shareCount: 1,
            commentCount: 1,

            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
    );

    return result[0] ?? null;
  }

  async publishResource(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    publishedAt: Date,
  ): Promise<INutriResourceDetailsProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const resource = await this._model
      .findOneAndUpdate(
        {
          _id: resourceObjectId,
          createdBy: nutritionistObjectId,
          status: "draft",
        },
        {
          $set: {
            status: "published",
            publishedAt,
          },
        },
        {
          new: true,
          projection: {
            _id: 1,
            title: 1,
            description: 1,
            type: 1,
            content: 1,
            fileUrl: 1,
            externalUrl: 1,
            thumbnailUrl: 1,
            category: 1,
            status: 1,
            publishedAt: 1,
            isDownloadable: 1,
            viewCount: 1,
            downloadCount: 1,
            likeCount: 1,
            bookmarkCount: 1,
            shareCount: 1,
            commentCount: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .lean()
      .exec();

    if (!resource) {
      return null;
    }

    return {
      resourceId: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      content: resource.content,
      fileUrl: resource.fileUrl,
      externalUrl: resource.externalUrl,
      thumbnailUrl: resource.thumbnailUrl,
      category: resource.category,
      status: resource.status,
      publishedAt: resource.publishedAt,
      isDownloadable: resource.isDownloadable,
      viewCount: resource.viewCount,
      downloadCount: resource.downloadCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      shareCount: resource.shareCount,
      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  async archiveResource(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceDetailsProjection | null> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const resource = await this._model
      .findOneAndUpdate(
        {
          _id: resourceObjectId,
          createdBy: nutritionistObjectId,
          status: {
            $in: ["draft", "published"] as ResourceStatus[],
          },
        },
        {
          $set: {
            status: "archived",
          },
        },
        {
          new: true,
          projection: {
            _id: 1,
            title: 1,
            description: 1,
            type: 1,
            content: 1,
            fileUrl: 1,
            externalUrl: 1,
            thumbnailUrl: 1,
            category: 1,
            status: 1,
            publishedAt: 1,
            isDownloadable: 1,
            viewCount: 1,
            downloadCount: 1,
            likeCount: 1,
            bookmarkCount: 1,
            shareCount: 1,
            commentCount: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .lean()
      .exec();

    if (!resource) {
      return null;
    }

    return {
      resourceId: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      content: resource.content,
      fileUrl: resource.fileUrl,
      externalUrl: resource.externalUrl,
      thumbnailUrl: resource.thumbnailUrl,
      category: resource.category,
      status: resource.status,
      publishedAt: resource.publishedAt,
      isDownloadable: resource.isDownloadable,
      viewCount: resource.viewCount,
      downloadCount: resource.downloadCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      shareCount: resource.shareCount,
      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}
