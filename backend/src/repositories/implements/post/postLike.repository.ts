import { injectable } from "inversify";
import { Types } from "mongoose";
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
    return this.findOne({ postId, userId });
  }
}
