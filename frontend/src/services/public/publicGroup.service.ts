import { clientApi } from "@/lib/axios/clientApi";

import { PUBLIC_GROUP_ROUTES } from "@/routes/public/group.routes";

import { PublicGroupListItemDTO } from "@/dtos/public/group/public-group-list-item.dto";

import { PublicGroupDetailsDTO } from "@/dtos/public/group/public-group-details.dto";

import { PublicGroupListQueryDTO } from "@/dtos/public/group/public-group-list-query.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const publicGroupService = {
  async getGroups(
    query?: PublicGroupListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<PublicGroupListItemDTO>>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PublicGroupListItemDTO>>
    >(PUBLIC_GROUP_ROUTES.GROUPS, {
      params: query,
    });

    return response.data;
  },

  async getGroupDetails(
    groupId: string,
  ): Promise<ApiResponseDTO<PublicGroupDetailsDTO>> {
    const response = await clientApi.get<ApiResponseDTO<PublicGroupDetailsDTO>>(
      PUBLIC_GROUP_ROUTES.DETAILS(groupId),
    );

    return response.data;
  },

  async joinGroup(
    groupId: string,
  ): Promise<ApiResponseDTO<PublicGroupDetailsDTO>> {
    const response = await clientApi.post<
      ApiResponseDTO<PublicGroupDetailsDTO>
    >(PUBLIC_GROUP_ROUTES.JOIN(groupId));

    return response.data;
  },
};
