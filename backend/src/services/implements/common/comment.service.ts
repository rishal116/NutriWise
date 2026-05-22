import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { ICommentService } from "../../interfaces/common/ICommentService";
import { ICommentRepository } from "../../../repositories/interfaces/common/ICommentRepository";
import { IPostRepository } from "../../../repositories/interfaces/common/IPostRepository";
import { IComment } from "../../../models/comment.model";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.ICommentRepository)
    private _commentRepo: ICommentRepository,
    @inject(TYPES.IPostRepository)
    private _postRepo: IPostRepository
  ) {}

  async addComment(data: Partial<IComment>): Promise<IComment> {
    const comment = await this._commentRepo.create(data);
    if (data.postId) {
      await this._postRepo.incrementCommentCount(data.postId.toString());
    }
    return comment;
  }

  async getPostComments(postId: string): Promise<IComment[]> {
    return await this._commentRepo.findByPost(postId);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const deleted = await this._commentRepo.deleteById(commentId);
    return deleted > 0;
  }
}
