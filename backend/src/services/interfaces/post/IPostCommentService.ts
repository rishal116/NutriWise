import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PostCommentResponseDto } from "../../../dtos/post/post-comment-response.dto";

export interface IPostCommentService {
  createComment(postId: string, userId: string, content: string): Promise<void>;

  getComments(
    postId: string,
    limit?: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<PostCommentResponseDto>>;

  deleteComment(commentId: string, userId: string): Promise<void>;
}
