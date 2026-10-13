import { ClientSession, Types } from "mongoose";
import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IPostBookmarkRepository } from "../../interfaces/post/IPostBookmarkRepository";
import {
  IPostBookmark,
  PostBookmarkModel,
} from "../../../models/postBookmark.model";

@injectable()
export class PostBookmarkRepository
  extends BaseRepository<IPostBookmark>
  implements IPostBookmarkRepository
{
  constructor() {
    super(PostBookmarkModel);
  }

  async findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostBookmark | null> {
    return this._model
      .findOne({ postId, userId })
      .lean<IPostBookmark | null>()
      .exec();
  }

  async deleteByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<boolean> {
    const query = this._model.deleteOne({ postId, userId });

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
    return this._model
      .countDocuments({ postId })
      .session(session ?? null)
      .exec();
  }
}
