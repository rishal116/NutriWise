import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_RESOURCE_ROUTES } from "@/routes/admin";
import type { AdminResourceQueryDTO } from "@/dtos/admin/resource/admin-resource-query.dto";
import type { AdminResourceListItemDTO } from "@/dtos/admin/resource/admin-resource-list-item.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminResourceService = {
  async getResources(
    query: AdminResourceQueryDTO = {},
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<AdminResourceListItemDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminResourceListItemDTO>>
    >(ADMIN_RESOURCE_ROUTES.LIST, {
      params: query,
    });

    return response.data;
  },

  async deleteResource(resourceId: string): Promise<void> {
    await clientApi.delete(ADMIN_RESOURCE_ROUTES.DELETE(resourceId));
  },
};