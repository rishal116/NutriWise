import { IPostComment } from "../../../models/postComment.model";

export interface IPostCommentService {
  createComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<IPostComment>;

  getComments(
    postId: string,
    limit?: number,
    cursor?: { createdAt: Date; id: string },
  ): Promise<{
    comments: IPostComment[];
    nextCursor: { createdAt: Date; id: string } | null;
    hasMore: boolean;
  }>;

  deleteComment(commentId: string, userId: string): Promise<void>;
}
