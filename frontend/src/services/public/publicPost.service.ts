import { clientApi } from "@/lib/axios/clientApi";
import { PUBLIC_POST_ROUTES } from "@/routes/public/public-post.routes";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { PublicPostResponseDTO } from "@/dtos/post/public-post-response.dto";

export const publicPostService = {
  async getPosts(
    cursor?: string,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostResponseDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicPostResponseDTO>>
    >(PUBLIC_POST_ROUTES.POSTS, {
      params: cursor ? { cursor } : undefined,
    });

    return response.data;
  },

  async getPostDetails(
    postId: string,
  ): Promise<ApiResponseDTO<PublicPostResponseDTO>> {
    const response = await clientApi.get<ApiResponseDTO<PublicPostResponseDTO>>(
      PUBLIC_POST_ROUTES.DETAILS(postId),
    );

    return response.data;
  },
};
