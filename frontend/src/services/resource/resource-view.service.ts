import { clientApi } from "@/lib/axios/clientApi";
import { RESOURCE_VIEW_ROUTES } from "@/routes/resource";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const resourceViewService = {
  async recordView(resourceId: string): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.post<ApiResponseDTO<null>>(
      RESOURCE_VIEW_ROUTES.VIEW(resourceId),
    );

    return response.data;
  },
};
