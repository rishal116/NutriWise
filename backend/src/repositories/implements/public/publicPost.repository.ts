import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IPost, PostModel } from "../../../models/post.model";
import { IPublicPostRepository } from "../../interfaces/public/IPublicPostRepository";
import { PublicPostListQueryDTO } from "../../../dtos/public/post/public-post-list-query.dto";
import {
  IPublicPostListItemProjection,
  IPublicPostListProjectionWithCursor,
} from "../../../types/public/post/public-post-list-item.projection";
import { IPublicPostDetailsProjection } from "../../../types/public/post/public-post-details.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

@injectable()
export class PublicPostRepository
  extends BaseRepository<IPost>
  implements IPublicPostRepository
{
  constructor() {
    super(PostModel);
  }

  async findPublicPosts(
    query: PublicPostListQueryDTO,
    userId?: string,
  ): Promise<CursorPaginationResult<IPublicPostListItemProjection>> {
    return this.findPublicPostsByFilter(query, undefined, userId);
  }

  async findPublicPostsByAuthor(
    authorId: string | Types.ObjectId,
    query: PublicPostListQueryDTO,
  ): Promise<CursorPaginationResult<IPublicPostListItemProjection>> {
    if (!Types.ObjectId.isValid(authorId)) {
      throw new Error("Invalid author ID");
    }

    return this.findPublicPostsByFilter(query, authorId);
  }

  private async findPublicPostsByFilter(
    query: PublicPostListQueryDTO,
    authorId?: string | Types.ObjectId,
    userId?: string,
  ): Promise<CursorPaginationResult<IPublicPostListItemProjection>> {
    const {
      limit = 12,
      cursor,
      search,
      mediaType,
      sortBy = "latest",
      authorId: queryAuthorId,
    } = query;

    const sortDirection = sortBy === "oldest" ? 1 : -1;

    const sortStage: Record<string, 1 | -1> = {
      createdAt: sortDirection,
      _id: sortDirection,
    };

    const cursorSortKey = `${sortBy}:createdAt:${sortDirection}`;

    const match: Record<string, unknown> = {};

    const selectedAuthorId = authorId ?? queryAuthorId;

    if (selectedAuthorId) {
      if (!Types.ObjectId.isValid(selectedAuthorId)) {
        throw new Error("Invalid author ID");
      }

      match.authorId = new Types.ObjectId(selectedAuthorId);
    }

    if (mediaType) {
      match["media.type"] = mediaType;
    }

    const pipeline: PipelineStage[] = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
    );

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              content: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "author.fullName": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (
        cursorData.sortKey !== cursorSortKey ||
        !Types.ObjectId.isValid(cursorData.id) ||
        typeof cursorData.value !== "string" ||
        Number.isNaN(Date.parse(cursorData.value))
      ) {
        throw new Error("Invalid cursor");
      }

      const cursorValue = new Date(cursorData.value);
      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

      pipeline.push({
        $match: {
          $or: [
            {
              createdAt: {
                [comparisonOperator]: cursorValue,
              },
            },
            {
              createdAt: cursorValue,
              _id: {
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push({ $sort: sortStage }, { $limit: limit + 1 });

    if (userId && Types.ObjectId.isValid(userId)) {
      pipeline.push({
        $lookup: {
          from: "postlikes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                userId: new Types.ObjectId(userId),
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "userLike",
        },
      });
    }

    pipeline.push({
      $project: {
        _id: 0,
        postId: { $toString: "$_id" },
        content: 1,
        media: 1,
        likeCount: 1,
        isLiked: userId
          ? { $gt: [{ $size: "$userLike" }, 0] }
          : { $literal: false },
        commentCount: 1,
        bookmarkCount: 1,
        createdAt: 1,
        updatedAt: 1,
        author: {
          authorId: { $toString: "$author._id" },
          name: "$author.fullName",
          profileImage: "$author.profileImage",
        },
        cursorId: { $toString: "$_id" },
        cursorValue: "$createdAt",
      },
    });

    const result =
      await this._model.aggregate<IPublicPostListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      nextCursor = encodeCursor({
        id: lastItem.cursorId,
        value: lastItem.cursorValue.toISOString(),
        sortKey: cursorSortKey,
      });
    }

    const postItems: IPublicPostListItemProjection[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...post }) => post,
    );

    return {
      items: postItems,
      nextCursor,
      hasMore,
    };
  }

  async findPublicPostDetails(
    postId: string | Types.ObjectId,
  ): Promise<IPublicPostDetailsProjection | null> {
    if (!Types.ObjectId.isValid(postId)) {
      return null;
    }

    const postObjectId =
      typeof postId === "string" ? new Types.ObjectId(postId) : postId;

    const result = await this._model.aggregate<IPublicPostDetailsProjection>([
      {
        $match: {
          _id: postObjectId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: 0,
          postId: { $toString: "$_id" },
          content: 1,
          media: 1,
          likeCount: 1,
          commentCount: 1,
          bookmarkCount: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            authorId: { $toString: "$author._id" },
            name: "$author.fullName",
            profileImage: "$author.profileImage",
          },
        },
      },
    ]);

    return result[0] ?? null;
  }
}
