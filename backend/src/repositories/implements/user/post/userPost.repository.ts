import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../../common/base.repository";

import { IUserPostRepository } from "../../../interfaces/user/post/IUserPostRepository";

import { IPost, PostModel } from "../../../../models/post.model";

import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";

import { IUserPostCard } from "../../../../types/user/post/user-post-card.type";

import { IUserPostDetails } from "../../../../types/user/post/user-post-details.type";

import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { PostListQueryDTO, PostSortOption } from "../../../../dtos/user/post/post-list-query.dto";

interface IPostCardWithCursor extends IUserPostCard {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

@injectable()
export class UserPostRepository
  extends BaseRepository<IPost>
  implements IUserPostRepository
{
  constructor() {
    super(PostModel);
  }

  async browseMyPosts(
    userId: string | Types.ObjectId,
    query: PostListQueryDTO,
  ): Promise<CursorPaginationResult<IUserPostCard>> {
    const { limit = 12, cursor, search, sortBy = "latest" } = query;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const cursorData = decodeCursor(cursor);

    const sortFieldMap: Record<
      PostSortOption,
      { field: string; order: 1 | -1 }
    > = {
      latest: { field: "createdAt", order: -1 },
      oldest: { field: "createdAt", order: 1 },
      most_liked: { field: "likeCount", order: -1 },
      most_commented: { field: "commentCount", order: -1 },
      most_bookmarked: { field: "bookmarkCount", order: -1 },
    };

    const { field: sortField, order: sortOrder } = sortFieldMap[sortBy];

    const pipeline: PipelineStage[] = [
      {
        $match: {
          authorId: userObjectId,
        },
      },
    ];

    if (search?.trim()) {
      pipeline.push({
        $match: {
          content: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      });
    }

    if (cursorData) {
      const cursorValue = cursorData.value;
      const cursorId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [sortOrder === -1 ? "$lt" : "$gt"]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [sortOrder === -1 ? "$lt" : "$gt"]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortOrder,
          _id: sortOrder,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          content: 1,
          media: 1,
          likeCount: 1,
          commentCount: 1,
          bookmarkCount: 1,
          createdAt: 1,
          updatedAt: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result = await this._model.aggregate<IPostCardWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toString(),
          })
        : null;

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findMyPostDetails(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<IUserPostDetails | null> {
    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const postObjectId =
      typeof postId === "string" ? new Types.ObjectId(postId) : postId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: postObjectId,
          authorId: userObjectId,
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          authorId: {
            $toString: "$authorId",
          },
          content: 1,
          media: 1,
          likeCount: 1,
          commentCount: 1,
          bookmarkCount: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const [post] = await this._model.aggregate<IUserPostDetails>(pipeline);

    return post ?? null;
  }
}
