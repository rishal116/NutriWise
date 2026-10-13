import { clientApi } from "@/lib/axios/clientApi";

import { GROUP_ROUTES } from "@/routes/chat";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

interface JoinPrivateGroupResponseDTO {
  groupId: string;
  joined: boolean;
}

export const groupService = {
  joinPrivateGroup: async (
    inviteToken: string,
  ): Promise<ApiResponseDTO<JoinPrivateGroupResponseDTO>> => {
    const res = await clientApi.post<
      ApiResponseDTO<JoinPrivateGroupResponseDTO>
    >(GROUP_ROUTES.JOIN_PRIVATE, {
      inviteToken,
    });

    return res.data;
  },
};
