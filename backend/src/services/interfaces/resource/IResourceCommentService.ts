import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ResourceCommentDTO } from "../../../dtos/public/resource/resource-comment.dto";

export interface IResourceCommentService {
  addComment(
    resourceId: string,
    userId: string,
    content: string,
  ): Promise<void>;

  getComments(
    resourceId: string,
    limit?: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<ResourceCommentDTO>>;

  deleteComment(commentId: string, userId: string): Promise<void>;
}
