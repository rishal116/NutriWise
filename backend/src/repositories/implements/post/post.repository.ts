import { injectable } from "inversify";
import { ClientSession, Types } from "mongoose";

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

  async incrementLikeCount(postId: string): Promise<number> {
    return this.updateOne(
      { _id: new Types.ObjectId(postId) },
      { $inc: { likeCount: 1 } },
    );
  }

  async decrementLikeCount(postId: string): Promise<number> {
    return this.updateOne(
      {
        _id: new Types.ObjectId(postId),
        likeCount: { $gt: 0 },
      },
      { $inc: { likeCount: -1 } },
    );
  }

  async incrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateOne(
      { _id: new Types.ObjectId(postId) },
      { $inc: { commentCount: 1 } },
      session,
    );
  }

  async decrementCommentCount(
    postId: string,
    session?: ClientSession,
  ): Promise<number> {
    return this.updateOne(
      {
        _id: new Types.ObjectId(postId),
        commentCount: { $gt: 0 },
      },
      { $inc: { commentCount: -1 } },
      session,
    );
  }
}
