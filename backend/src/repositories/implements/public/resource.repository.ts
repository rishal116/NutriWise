import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IResource, ResourceModel } from "../../../models/resource.model";

import { IResourceRepository } from "../../interfaces/public/IResourceRepository";

import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import { IResourceListItemProjection } from "../../../types/public/resource/resource-list-item-projection";
import { IResourceDetailsProjection } from "../../../types/public/resource/resource-details-projection";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

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
      sortBy = "LATEST",
    } = query;

    const searchText = search?.trim();

    const filter: Record<string, unknown> = {
      status: "published",
    };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (searchText) {
      filter.$text = {
        $search: searchText,
      };
    }

    /**
     * ----------------------------------------
     * SORT CONFIGURATION
     * ----------------------------------------
     */

    let sortField: string;
    let sortDirection: 1 | -1;

    switch (sortBy) {
      case "OLDEST":
        sortField = "publishedAt";
        sortDirection = 1;
        break;

      case "TITLE_ASC":
        sortField = "title";
        sortDirection = 1;
        break;

      case "TITLE_DESC":
        sortField = "title";
        sortDirection = -1;
        break;

      case "MOST_VIEWED":
        sortField = "viewCount";
        sortDirection = -1;
        break;

      case "MOST_DOWNLOADED":
        sortField = "downloadCount";
        sortDirection = -1;
        break;

      case "LATEST":
      default:
        sortField = "publishedAt";
        sortDirection = -1;
        break;
    }

    /**
     * ----------------------------------------
     * CURSOR
     * ----------------------------------------
     */

    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    const cursorSortKey = `${sortBy}:${sortDirection}`;

    if (decodedCursor?.sortKey && decodedCursor.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor");
    }

    if (decodedCursor) {
      let cursorValue: string | number | Date = decodedCursor.value;

      /**
       * Dates are encoded as strings.
       */
      if (sortField === "publishedAt" || sortField === "createdAt") {
        cursorValue = new Date(decodedCursor.value);
      }

      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

      filter.$or = [
        {
          [sortField]: {
            [comparisonOperator]: cursorValue,
          },
        },
        {
          [sortField]: cursorValue,
          _id: {
            [comparisonOperator]: new Types.ObjectId(decodedCursor.id),
          },
        },
      ];
    }

    /**
     * ----------------------------------------
     * SORT
     * ----------------------------------------
     */

    const sort: Record<string, 1 | -1> = {
      [sortField]: sortDirection,
      _id: sortDirection,
    };

    /**
     * ----------------------------------------
     * QUERY
     * ----------------------------------------
     */

    const documents = await this._model
      .find(filter)
      .sort(sort)
      .limit(limit + 1)
      .select({
        _id: 1,
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
        publishedAt: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean();

    /**
     * ----------------------------------------
     * PAGINATION
     * ----------------------------------------
     */

    const hasMore = documents.length > limit;

    const items = hasMore ? documents.slice(0, limit) : documents;

    /**
     * ----------------------------------------
     * NEXT CURSOR
     * ----------------------------------------
     */

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      const rawCursorValue = lastItem[sortField as keyof typeof lastItem];

      let cursorValue: string | number | Date;

      if (rawCursorValue instanceof Date) {
        cursorValue = rawCursorValue.toISOString();
      } else {
        cursorValue = rawCursorValue as string | number;
      }

      nextCursor = encodeCursor({
        id: lastItem._id.toString(),
        value: cursorValue,
        sortKey: cursorSortKey,
      });
    }

    /**
     * ----------------------------------------
     * MAP RESPONSE
     * ----------------------------------------
     */

    const mappedItems: IResourceListItemProjection[] = items.map(
      (resource) => ({
        resourceId: resource._id.toString(),
        title: resource.title,
        description: resource.description,
        type: resource.type,
        thumbnailUrl: resource.thumbnailUrl,
        category: resource.category,
        status: resource.status,
        isDownloadable: resource.isDownloadable,
        viewCount: resource.viewCount,
        downloadCount: resource.downloadCount,
        likeCount: resource.likeCount,
        bookmarkCount: resource.bookmarkCount,
        shareCount: resource.shareCount,
        commentCount: resource.commentCount,
        publishedAt: resource.publishedAt,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      }),
    );

    return {
      items: mappedItems,
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

    const resource = await this._model
      .findOne({
        _id: resourceObjectId,
        status: "published",
      })
      .select({
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
      })
      .lean();

    if (!resource) {
      return null;
    }

    return {
      resourceId: resource._id.toString(),
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

  async incrementDownloadCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          downloadCount: 1,
        },
      },
    );
  }

  async incrementShareCount(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: resourceId,
        status: "published",
      },
      {
        $inc: {
          shareCount: 1,
        },
      },
    );
  }
}
