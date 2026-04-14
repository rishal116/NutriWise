import { api } from "@/lib/axios/api";
import { GetGroupsResponse } from "@/types/group.types";

export const userGroupService = {
  getGroups: async (payload: {
    limit: number;
    skip: number;
  }): Promise<GetGroupsResponse> => {
    const res = await api.get("/groups", {
      params: payload,
    });

    return res.data;
  },
  joinGroup: async (groupId: string) => {
  const res = await api.post(`/groups/${groupId}/join`);
  return res.data;
},
};
