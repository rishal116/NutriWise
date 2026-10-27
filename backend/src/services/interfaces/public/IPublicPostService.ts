import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PublicPostResponseDTO } from "../../../dtos/post/public-post-response.dto"; 

export interface IPublicPostService {
  browsePosts(
    userId?: string,
  ): Promise<InfiniteScrollResponseDTO<PublicPostResponseDTO>>;

  getPost(postId: string, userId?: string): Promise<PublicPostResponseDTO>;
}
