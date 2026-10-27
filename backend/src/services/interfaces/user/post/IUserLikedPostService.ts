import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { IUserLikedPost } from "../../../../types/user/post/user-liked-post.type";
import { PostListQueryDTO } from "../../../../dtos/user/post/post-list-query.dto";

export interface IUserLikedPostService {
  browseMyLikedPosts(
    userId: string,
    query: PostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<IUserLikedPost>>;

  findMyLikedPostDetails(
    userId: string,
    postId: string,
  ): Promise<IUserLikedPost>;
}
