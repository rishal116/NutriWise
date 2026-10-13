import { ClientSession, Types } from "mongoose";
import { injectable } from "inversify";

import { BaseRepository } from "../common/base.repository";
import {
  IPostCommentCursor,
  IPostCommentRepository,
} from "../../interfaces/post/IPostCommentRepository";
import {
  IPostComment,
  PostCommentModel,
} from "../../../models/postComment.model";

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
    cursor?: IPostCommentCursor,
  ): Promise<IPostComment[]> {
    const filter = cursor
      ? {
          postId,
          $or: [
            { createdAt: { $lt: cursor.createdAt } },
            {
              createdAt: cursor.createdAt,
              _id: { $lt: cursor.id },
            },
          ],
        }
      : { postId };

    return this._model
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IPostComment[]>()
      .exec();
  }

  async deleteById(
    commentId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<boolean> {
    const query = this._model.deleteOne({ _id: commentId });

    if (session) {
      query.session(session);
    }

    const result = await query.exec();

    return result.deletedCount > 0;
  }

  async countByPostId(
    postId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const query = this._model.countDocuments({ postId });

    if (session) {
      query.session(session);
    }

    return query.exec();
  }
}
