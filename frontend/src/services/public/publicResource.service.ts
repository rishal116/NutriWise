import { clientApi } from "@/lib/axios/clientApi";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { PUBLIC_RESOURCE_ROUTES } from "@/routes/public/resource.routes";

import { PublicResourceListQueryDTO } from "@/dtos/public/resource/public-resource-list-query.dto";
import { PublicResourceListItemDTO } from "@/dtos/public/resource/public-resource-list-item.dto";
import { PublicResourceDetailsDTO } from "@/dtos/public/resource/public-resource-details.dto";

export const publicResourceService = {
  getResources: async (
    query?: PublicResourceListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<PublicResourceListItemDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicResourceListItemDTO>>
    >(PUBLIC_RESOURCE_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  getResourceDetails: async (
    resourceId: string,
  ): Promise<ApiResponseDTO<PublicResourceDetailsDTO>> => {
    const res = await clientApi.get<
      ApiResponseDTO<PublicResourceDetailsDTO>
    >(PUBLIC_RESOURCE_ROUTES.DETAILS(resourceId));

    return res.data;
  },

  recordView: async (
    resourceId: string,
  ): Promise<ApiResponseDTO<null>> => {
    const res = await clientApi.post<ApiResponseDTO<null>>(
      PUBLIC_RESOURCE_ROUTES.VIEW(resourceId),
    );

    return res.data;
  },

  recordDownload: async (
    resourceId: string,
  ): Promise<ApiResponseDTO<null>> => {
    const res = await clientApi.post<ApiResponseDTO<null>>(
      PUBLIC_RESOURCE_ROUTES.DOWNLOAD(resourceId),
    );

    return res.data;
  },

  recordShare: async (
    resourceId: string,
  ): Promise<ApiResponseDTO<null>> => {
    const res = await clientApi.post<ApiResponseDTO<null>>(
      PUBLIC_RESOURCE_ROUTES.SHARE(resourceId),
    );

    return res.data;
  },
};