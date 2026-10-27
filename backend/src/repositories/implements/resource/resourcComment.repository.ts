import { injectable } from "inversify";
import { Types } from "mongoose";

import {
  IResourceComment,
  ResourceCommentModel,
} from "../../../models/resourceComment.model";
import { BaseRepository } from "../common/base.repository";
import { IResourceCommentRepository } from "../../interfaces/resource/IResourceCommentRepository";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IResourceCommentProjection } from "../../../types/resource/resource-comment.projection";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

@injectable()
export class ResourceCommentRepository
  extends BaseRepository<IResourceComment>
  implements IResourceCommentRepository
{
  constructor() {
    super(ResourceCommentModel);
  }

  async findByResource(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceCommentProjection[]> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    return this._model
      .find({ resourceId: resourceObjectId })
      .populate({
        path: "userId",
        select: "fullName profileImage",
      })
      .sort({ createdAt: -1, _id: -1 })
      .lean<IResourceCommentProjection[]>()
      .exec();
  }

  async findByResourceId(
    resourceId: string | Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IResourceCommentProjection>> {
    const resourceObjectId =
      typeof resourceId === "string"
        ? new Types.ObjectId(resourceId)
        : resourceId;

    const decodedCursor = decodeCursor(cursor);

    const filter = {
      resourceId: resourceObjectId,
      ...(decodedCursor && {
        $or: [
          { createdAt: { $lt: new Date(decodedCursor.value) } },
          {
            createdAt: new Date(decodedCursor.value),
            _id: { $lt: new Types.ObjectId(decodedCursor.id) },
          },
        ],
      }),
    };

    const comments = await this._model
      .find(filter)
      .populate({
        path: "userId",
        select: "fullName profileImage",
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IResourceCommentProjection[]>()
      .exec();

    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, limit) : comments;
    const lastItem = items.at(-1);

    return {
      items,
      hasMore,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt.toISOString(),
              id: lastItem._id.toString(),
            })
          : null,
    };
  }

  async deleteByResourceAndUser(
    commentId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<boolean> {
    const commentObjectId =
      typeof commentId === "string" ? new Types.ObjectId(commentId) : commentId;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const deletedCount = await this.deleteOne({
      _id: commentObjectId,
      userId: userObjectId,
    });

    return deletedCount > 0;
  }
}
