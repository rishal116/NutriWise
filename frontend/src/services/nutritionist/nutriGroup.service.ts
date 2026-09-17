import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_GROUP_ROUTES } from "@/routes/nutritionist";

import type { CreateGroupDTO } from "@/dtos/nutritionist/group/create-group.dto";
import type { GroupListItemDTO } from "@/dtos/nutritionist/group/group-list-item.dto";
import type { GroupDetailsDTO } from "@/dtos/nutritionist/group/group-details.dto";
import type { NutritionistGroupListQueryDTO } from "@/dtos/nutritionist/group/group-list-query.dto";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const nutriGroupService = {
  async createGroup(payload: CreateGroupDTO): Promise<GroupDetailsDTO> {
    const res = await clientApi.post<ApiResponseDTO<GroupDetailsDTO>>(
      NUTRITIONIST_GROUP_ROUTES.GROUPS,
      payload,
    );

    return res.data.data;
  },

  async getGroups(
    query?: NutritionistGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<GroupListItemDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<GroupListItemDTO>>
    >(NUTRITIONIST_GROUP_ROUTES.GROUPS, {
      params: query,
    });

    return res.data.data;
  },

  async getGroupById(groupId: string): Promise<GroupDetailsDTO> {
    const res = await clientApi.get<ApiResponseDTO<GroupDetailsDTO>>(
      NUTRITIONIST_GROUP_ROUTES.GROUP_BY_ID(groupId),
    );

    return res.data.data;
  },
};
