import { clientApi } from "@/lib/axios/clientApi";
import { POST_LIKE_ROUTES } from "@/routes/post";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export interface PostLikeDTO {
  isLiked: boolean;
  likeCount: number;
}

export const postLikeService = {
  async likePost(postId: string): Promise<ApiResponseDTO<PostLikeDTO>> {
    const response = await clientApi.post<ApiResponseDTO<PostLikeDTO>>(
      POST_LIKE_ROUTES.LIKE(postId),
    );

    return response.data;
  },

  async unlikePost(postId: string): Promise<ApiResponseDTO<PostLikeDTO>> {
    const response = await clientApi.delete<ApiResponseDTO<PostLikeDTO>>(
      POST_LIKE_ROUTES.LIKE(postId),
    );

    return response.data;
  },
};
