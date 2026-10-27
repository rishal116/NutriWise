import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";
import { IPostCommentRepository } from "../../interfaces/post/IPostCommentRepository";
import {
  IPostComment,
  PostCommentModel,
} from "../../../models/postComment.model";
import { UserModel } from "../../../models/user.model";
import { IPostCommentResponse } from "../../../types/post/post-comment-response.type";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

@injectable()
export class PostCommentRepository
  extends BaseRepository<IPostComment>
  implements IPostCommentRepository
{
  constructor() {
    super(PostCommentModel);
  }

  async findByPostId(
    postId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IPostCommentResponse>> {
    const decodedCursor = decodeCursor(cursor);

    if (
      decodedCursor &&
      (typeof decodedCursor.value !== "string" ||
        !Number.isFinite(new Date(decodedCursor.value).getTime()))
    ) {
      throw new Error("Invalid comment cursor");
    }

    const parsedCursor = decodedCursor
      ? {
          createdAt: new Date(decodedCursor.value as string),
          id: new Types.ObjectId(decodedCursor.id),
        }
      : undefined;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          postId,
          ...(parsedCursor
            ? {
                $or: [
                  { createdAt: { $lt: parsedCursor.createdAt } },
                  {
                    createdAt: parsedCursor.createdAt,
                    _id: { $lt: parsedCursor.id },
                  },
                ],
              }
            : {}),
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "_id",
          as: "commenter",
        },
      },
      {
        $unwind: {
          path: "$commenter",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          postId: { $toString: "$postId" },
          username: "$commenter.username",
          profileImage: "$commenter.profileImage",
          content: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const results = await this._model
      .aggregate<IPostCommentResponse>(pipeline)
      .exec();

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    const lastComment = items.at(-1);

    return {
      items,
      hasMore,
      nextCursor:
        hasMore && lastComment
          ? encodeCursor({
              value: lastComment.createdAt,
              id: lastComment._id,
            })
          : null,
    };
  }
}
