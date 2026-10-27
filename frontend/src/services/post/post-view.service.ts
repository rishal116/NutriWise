import { clientApi } from "@/lib/axios/clientApi";
import { POST_VIEW_ROUTES } from "@/routes/post";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const postViewService = {
  async viewPost(postId: string): Promise<ApiResponseDTO> {
    const response = await clientApi.post<ApiResponseDTO>(
      POST_VIEW_ROUTES.VIEW(postId),
    );

    return response.data;
  },
};