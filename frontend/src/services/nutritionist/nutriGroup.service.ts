
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
    const { data } = await clientApi.post<ApiResponseDTO<GroupDetailsDTO>>(
      NUTRITIONIST_GROUP_ROUTES.GROUPS,
      payload,
    );

    if (!data.data) {
      throw new Error("Failed to create group.");
    }

    return data.data;
  },

  async getGroups(
    query?: NutritionistGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<GroupListItemDTO>> {
    const { data } = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<GroupListItemDTO>>
    >(NUTRITIONIST_GROUP_ROUTES.GROUPS, {
      params: query,
    });

    if (!data.data) {
      throw new Error("Failed to fetch groups.");
    }

    return data.data;
  },

  async getGroupById(groupId: string): Promise<GroupDetailsDTO> {
    const { data } = await clientApi.get<ApiResponseDTO<GroupDetailsDTO>>(
      NUTRITIONIST_GROUP_ROUTES.GROUP_BY_ID(groupId),
    );

    if (!data.data) {
      throw new Error("Group details not found.");
    }

    return data.data;
  },
};
