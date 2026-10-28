import type { AdminPostQueryDTO } from "../../../dtos/admin/post/admin-post.dto"; 
import type { AdminPostResponseDTO } from "../../../dtos/admin/post/admin-post-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IAdminPostService {
  getPosts(
    query: AdminPostQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminPostResponseDTO>>;

  deletePost(postId: string): Promise<void>;
}
