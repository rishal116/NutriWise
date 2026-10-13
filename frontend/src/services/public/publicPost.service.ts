import { clientApi } from "@/lib/axios/clientApi";

import { PUBLIC_POST_ROUTES } from "@/routes/public/public-post.routes";

import { PublicPostListItemDTO } from "@/dtos/public/post/public-post-list-item.dto";
import { PublicPostListQueryDTO } from "@/dtos/public/post/public-post-list-query.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const publicPostService = {
  async getPosts(
    query?: PublicPostListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostListItemDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostListItemDTO>>
    >(PUBLIC_POST_ROUTES.POSTS, {
      params: query,
    });

    return response.data;
  },

  async getPostDetails(
    postId: string,
  ): Promise<ApiResponseDTO<PublicPostListItemDTO>> {
    const response = await clientApi.get<ApiResponseDTO<PublicPostListItemDTO>>(
      PUBLIC_POST_ROUTES.DETAILS(postId),
    );

    return response.data;
  },

  async getPostsByAuthor(
    userId: string,
    query?: PublicPostListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostListItemDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostListItemDTO>>
    >(PUBLIC_POST_ROUTES.BY_AUTHOR(userId), {
      params: query,
    });

    return response.data;
  },
};
