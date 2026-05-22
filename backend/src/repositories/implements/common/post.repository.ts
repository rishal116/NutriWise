import { injectable } from "inversify";
import { IPostRepository } from "../../interfaces/common/IPostRepository";
import { IPost, PostModel } from "../../../models/post.model";
import { BaseRepository } from "./base.repository";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor() {
    super(PostModel);
  }

  async findAllPosts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this._model
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IPost[]>();
  }

  async findByAuthor(authorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this._model
      .find({ authorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IPost[]>();
  }

  async incrementCommentCount(postId: string): Promise<void> {
    await this._model.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });
  }
}