import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { PostModel } from "../../../models/post.model";
import { UserModel } from "../../../models/user.model";
import type { IPost } from "../../../models/post.model";
import type {
  IAdminPost,
  IAdminPostQuery,
} from "../../../types/admin/post/post.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { IAdminPostRepository } from "../../interfaces/admin/IAdminPostRepository";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { BaseRepository } from "../common/base.repository";

@injectable()
export class AdminPostRepository
  extends BaseRepository<IPost>
  implements IAdminPostRepository
{
  constructor() {
    super(PostModel);
  }

  async getPosts(
    query: IAdminPostQuery,
  ): Promise<CursorPaginationResult<IAdminPost>> {
    const { limit, cursor } = query;
    const decodedCursor = decodeCursor(cursor);

    const match: Record<string, unknown> = {};

    if (decodedCursor) {
      if (decodedCursor.sortKey && decodedCursor.sortKey !== "createdAt") {
        throw new Error("Invalid post cursor.");
      }

      const cursorDate = new Date(decodedCursor.value);

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid post cursor.");
      }

      match.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: new Types.ObjectId(decodedCursor.id) },
        },
      ];
    }

    const pipeline: PipelineStage[] = [
      { $match: match as PipelineStage.Match["$match"] },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          media: 1,
          viewCount: 1,
          likeCount: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: {
            $cond: [
              { $ifNull: ["$author._id", false] },
              {
                _id: "$author._id",
                fullName: "$author.fullName",
                profileImage: "$author.profileImage",
              },
              null,
            ],
          },
        },
      },
    ];

    const posts = await PostModel.aggregate<IAdminPost>(pipeline);

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;
    const lastPost = items.at(-1);

    return {
      items,
      nextCursor:
        hasMore && lastPost
          ? encodeCursor({
              id: lastPost._id.toString(),
              value: lastPost.createdAt.toISOString(),
              sortKey: "createdAt",
            })
          : null,
      hasMore,
    };
  }
}
