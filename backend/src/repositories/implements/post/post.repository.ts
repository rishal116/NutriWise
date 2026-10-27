import { injectable } from "inversify";
import { ClientSession, Types, UpdateQuery } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IPostRepository } from "../../interfaces/post/IPostRepository";
import { IPost, PostModel } from "../../../models/post.model";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor() {
    super(PostModel);
  }

  async incrementLikeCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateCount(postId, "likeCount", 1, session);
  }

  async decrementLikeCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateCount(postId, "likeCount", -1, session);
  }

  async incrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateCount(postId, "commentCount", 1, session);
  }

  async decrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateCount(postId, "commentCount", -1, session);
  }

  private async updateCount(
    postId: string,
    field: "likeCount" | "commentCount",
    amount: 1 | -1,
    session?: ClientSession,
  ): Promise<number> {
    const filter = {
      _id: new Types.ObjectId(postId),
      ...(amount < 0 ? { [field]: { $gt: 0 } } : {}),
    };

    const update: UpdateQuery<IPost> = {
      $inc: { [field]: amount },
    };

    return this.updateOne(filter, update, session);
  }
}
