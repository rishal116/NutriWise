import { PublicPostListQueryDTO } from "../../../dtos/public/post/public-post-list-query.dto";
import { PublicPostListItemDTO } from "../../../dtos/public/post/public-post-list-item.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IPublicPostService {
  browsePosts(
    query: PublicPostListQueryDTO,
     userId?: string,
  ): Promise<InfiniteScrollResponseDTO<PublicPostListItemDTO>>;

  getPost(postId: string): Promise<PublicPostListItemDTO>;

  browsePostsByAuthor(
    userId: string,
    query: PublicPostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicPostListItemDTO>>;
}
