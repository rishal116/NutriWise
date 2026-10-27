import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { IUserPostRepository } from "../../../interfaces/user/post/IUserPostRepository";
import { IPost, PostModel } from "../../../../models/post.model";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { IUserPost } from "../../../../types/user/post/user-post.type";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { PostViewModel } from "../../../../models/postView.schema";
import {
  PostListQueryDTO,
  PostSortOption,
} from "../../../../dtos/user/post/post-list-query.dto";
import { PostLikeModel } from "../../../../models/postLike.model";

interface IPostCardWithCursor extends IUserPost {
  cursorId: Types.ObjectId;
  cursorValue: Date | number;
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
  ): Promise<CursorPaginationResult<IUserPost>> {
    const { limit = 12, cursor, search, sortBy = "latest" } = query;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const cursorData = decodeCursor(cursor);

    const sortFieldMap: Record<
      PostSortOption,
      {
        field: "createdAt" | "likeCount" | "commentCount" | "viewCount";
        order: 1 | -1;
      }
    > = {
      latest: { field: "createdAt", order: -1 },
      oldest: { field: "createdAt", order: 1 },
      most_liked: { field: "likeCount", order: -1 },
      most_commented: { field: "commentCount", order: -1 },
      most_viewed: { field: "viewCount", order: -1 },
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
            $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        },
      });
    }

    if (cursorData) {
      const cursorValue =
        sortField === "createdAt"
          ? new Date(cursorData.value)
          : Number(cursorData.value);

      const cursorId = new Types.ObjectId(cursorData.id);
      const comparisonOperator = sortOrder === -1 ? "$lt" : "$gt";

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
                [comparisonOperator]: cursorId,
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
        $lookup: {
          from: PostViewModel.collection.name,
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "viewedByMe",
        },
      },
      {
        $lookup: {
          from: PostLikeModel.collection.name,
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "likedByMe",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          content: 1,
          media: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          isLikedByMe: {
            $gt: [{ $size: "$likedByMe" }, 0],
          },
          isViewedByMe: {
            $gt: [{ $size: "$viewedByMe" }, 0],
          },
          createdAt: 1,
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

    const cleanItems: IUserPost[] = items.map(
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
  ): Promise<IUserPost | null> {
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
        $lookup: {
          from: PostLikeModel.collection.name,
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "likedByMe",
        },
      },
      {
        $lookup: {
          from: PostViewModel.collection.name,
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: "viewedByMe",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          content: 1,
          media: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          isLikedByMe: {
            $gt: [{ $size: "$likedByMe" }, 0],
          },
          isViewedByMe: {
            $gt: [{ $size: "$viewedByMe" }, 0],
          },
          createdAt: 1,
        },
      },
    ];

    const [post] = await this._model.aggregate<IUserPost>(pipeline);

    return post ?? null;
  }
}
