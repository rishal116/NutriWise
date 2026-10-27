import { clientApi } from "@/lib/axios/clientApi";
import { POST_LIKE_ROUTES } from "@/routes/post";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const postLikeService = {
  async likePost(postId: string): Promise<ApiResponseDTO> {
    const response = await clientApi.post<ApiResponseDTO>(
      POST_LIKE_ROUTES.LIKE(postId),
    );

    return response.data;
  },

  async unlikePost(postId: string): Promise<ApiResponseDTO> {
    const response = await clientApi.delete<ApiResponseDTO>(
      POST_LIKE_ROUTES.LIKE(postId),
    );

    return response.data;
  },
};
