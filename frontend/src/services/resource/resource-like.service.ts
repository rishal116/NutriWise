import { clientApi } from "@/lib/axios/clientApi";
import { RESOURCE_LIKE_ROUTES } from "@/routes/resource";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const resourceLikeService = {
  async likeResource(
    resourceId: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.post<ApiResponseDTO<null>>(
      RESOURCE_LIKE_ROUTES.LIKE(resourceId),
    );

    return response.data;
  },

  async unlikeResource(
    resourceId: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      RESOURCE_LIKE_ROUTES.LIKE(resourceId),
    );

    return response.data;
  },
};