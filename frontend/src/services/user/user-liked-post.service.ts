import { clientApi } from "@/lib/axios/clientApi";
import { USER_LIKED_POST_ROUTES } from "@/routes/user";
import type { PostListQueryDTO } from "@/dtos/user/post/post-list-query.dto";
import type { UserLikedPostResponseDTO } from "@/dtos/user/post/user-liked-post-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const userLikedPostService = {
  async browseMyLikedPosts(
    query?: PostListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<UserLikedPostResponseDTO>>
  > {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserLikedPostResponseDTO>>
    >(USER_LIKED_POST_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  async getLikedPostDetails(
    postId: string,
  ): Promise<ApiResponseDTO<UserLikedPostResponseDTO>> {
    const res = await clientApi.get<ApiResponseDTO<UserLikedPostResponseDTO>>(
      USER_LIKED_POST_ROUTES.DETAILS(postId),
    );

    return res.data;
  },
};
