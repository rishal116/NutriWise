import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IPost, PostModel } from "../../../models/post.model";
import { IPublicPostRepository } from "../../interfaces/public/IPublicPostRepository";
import { PostViewModel } from "../../../models/postView.schema";
import { PostLikeModel } from "../../../models/postLike.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IUserPost } from "../../../types/user/post/user-post.type";
import { IPublicPost } from "../../../types/post/public-post.type";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

interface IPostCardWithCursor extends IUserPost {
  cursorId: Types.ObjectId;
}

@injectable()
export class PublicPostRepository
  extends BaseRepository<IPost>
  implements IPublicPostRepository
{
  constructor() {
    super(PostModel);
  }

  async browsePublicPosts(
    userId?: string | Types.ObjectId,
    limit = 12,
    cursor?: string,
  ): Promise<CursorPaginationResult<IPublicPost>> {
    const userObjectId =
      typeof userId === "string" && Types.ObjectId.isValid(userId)
        ? new Types.ObjectId(userId)
        : userId instanceof Types.ObjectId
          ? userId
          : undefined;

    const cursorData = decodeCursor(cursor);
    const pipeline: PipelineStage[] = [];

    if (cursorData) {
      if (!Types.ObjectId.isValid(cursorData.id)) {
        throw new Error("Invalid cursor");
      }

      pipeline.push({
        $match: {
          _id: { $lt: new Types.ObjectId(cursorData.id) },
        },
      });
    }

    pipeline.push(
      { $sort: { _id: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    );

    if (userObjectId) {
      pipeline.push(
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
      );
    }

    pipeline.push({
      $project: {
        _id: { $toString: "$_id" },
        content: 1,
        media: 1,
        viewCount: 1,
        likeCount: 1,
        commentCount: 1,
        isLikedByMe: userObjectId
          ? { $gt: [{ $size: "$likedByMe" }, 0] }
          : { $literal: false },
        isViewedByMe: userObjectId
          ? { $gt: [{ $size: "$viewedByMe" }, 0] }
          : { $literal: false },
        createdAt: 1,
        author: {
          authorId: { $toString: "$author._id" },
          name: "$author.fullName",
          profileImage: "$author.profileImage",
        },
        cursorId: "$_id",
      },
    });

    const result = await this._model.aggregate<IPostCardWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorId.toString(),
          })
        : null;

    const cleanItems: IPublicPost[] = items.map(
      ({ cursorId: _cursorId, ...item }) => item as IPublicPost,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findPublicPostDetails(
    postId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IPublicPost | null> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    const userObjectId =
      typeof userId === "string" && Types.ObjectId.isValid(userId)
        ? new Types.ObjectId(userId)
        : userId instanceof Types.ObjectId
          ? userId
          : undefined;

    const postObjectId =
      typeof postId === "string" ? new Types.ObjectId(postId) : postId;

    const pipeline: PipelineStage[] = [
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
      { $unwind: "$author" },
    ];

    if (userObjectId) {
      pipeline.push(
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
      );
    }

    pipeline.push({
      $project: {
        _id: { $toString: "$_id" },
        content: 1,
        media: 1,
        viewCount: 1,
        likeCount: 1,
        commentCount: 1,
        isLikedByMe: userObjectId
          ? { $gt: [{ $size: "$likedByMe" }, 0] }
          : { $literal: false },
        isViewedByMe: userObjectId
          ? { $gt: [{ $size: "$viewedByMe" }, 0] }
          : { $literal: false },
        createdAt: 1,
        author: {
          authorId: { $toString: "$author._id" },
          name: "$author.fullName",
          profileImage: "$author.profileImage",
        },
      },
    });

    const [post] = await this._model.aggregate<IPublicPost>(pipeline);

    return post ?? null;
  }
}
