import { IComment } from "../../../models/comment.model";

export interface ICommentService {
  addComment(data: Partial<IComment>): Promise<IComment>;
  getPostComments(postId: string): Promise<IComment[]>;
  deleteComment(commentId: string): Promise<boolean>;
}
