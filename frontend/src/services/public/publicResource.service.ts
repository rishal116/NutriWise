import { clientApi } from "@/lib/axios/clientApi";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { PUBLIC_RESOURCE_ROUTES } from "@/routes/public/resource.routes";

import type { PublicResourceListQueryDTO } from "@/dtos/public/resource/public-resource-list-query.dto";
import type { PublicResourceDTO } from "@/dtos/public/resource/public-resource-response.dto";

export const publicResourceService = {
  getResources: async (
    query?: PublicResourceListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<PublicResourceDTO>>> => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicResourceDTO>>
    >(PUBLIC_RESOURCE_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  getResourceDetails: async (
    resourceId: string,
  ): Promise<ApiResponseDTO<PublicResourceDTO>> => {
    const res = await clientApi.get<ApiResponseDTO<PublicResourceDTO>>(
      PUBLIC_RESOURCE_ROUTES.DETAILS(resourceId),
    );

    return res.data;
  },
};