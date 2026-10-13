import { ClientSession, Types } from "mongoose";
import { injectable } from "inversify";

import { BaseRepository } from "../common/base.repository";
import { IPostLikeRepository } from "../../interfaces/post/IPostLikeRepository";
import { IPostLike, PostLikeModel } from "../../../models/postLike.model";

@injectable()
export class PostLikeRepository
  extends BaseRepository<IPostLike>
  implements IPostLikeRepository
{
  constructor() {
    super(PostLikeModel);
  }

  async findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<IPostLike | null> {
    return this._model
      .findOne({ postId, userId })
      .lean<IPostLike | null>()
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
