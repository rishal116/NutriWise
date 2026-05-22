import { injectable } from "inversify";
import { ICommentRepository } from "../../interfaces/common/ICommentRepository";
import { IComment, CommentModel } from "../../../models/comment.model";
import { BaseRepository } from "./base.repository";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel);
  }

  async findByPost(postId: string): Promise<IComment[]> {
    return this._model
      .find({ postId, parentId: null })
      .sort({ createdAt: -1 })
      .lean<IComment[]>();
  }

  async findReplies(parentId: string): Promise<IComment[]> {
    return this._model
      .find({ parentId })
      .sort({ createdAt: 1 })
      .lean<IComment[]>();
  }
}