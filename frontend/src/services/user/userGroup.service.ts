import { clientApi } from "@/lib/axios/clientApi";
import { GetGroupsResponse } from "@/types/group.types";

export const userGroupService = {
  getGroups: async (payload: {
    limit: number;
    skip: number;
  }): Promise<GetGroupsResponse> => {
    const res = await clientApi.get("/groups", {
      params: payload,
    });

    return res.data;
  },
  joinGroup: async (groupId: string) => {
    const res = await clientApi.post(`/groups/${groupId}/join`);
    return res.data;
  },
};
