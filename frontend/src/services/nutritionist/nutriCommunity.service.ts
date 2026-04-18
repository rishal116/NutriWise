import { api } from "@/lib/axios/api";
import { Group } from "@/dtos/nutritionist/group.dto";

export const groupService = {
  createGroup: async (data: {
    title: string;
    description?: string;
    isPublic?: boolean;
  }) => {
    const res = await api.post("/nutritionist/groups", data);
    return res.data.data;
  },

  getMyGroups: async (params: { limit: number; skip: number }) => {
    const res = await api.get("/nutritionist/my-groups", {
      params,
    });

    return res.data.data as Group[];
  },

  getGroup: async (groupId: string) => {
    const res = await api.get(`/nutritionist/groups/${groupId}`);
    return res.data.data;
  },

  getJoinRequests: async (groupId: string) => {
    const res = await api.get(`/nutritionist/groups/${groupId}/requests`);
    return res.data.data;
  },

  acceptRequest: async (groupId: string, userId: string) => {
    await api.patch(
      `/nutritionist/groups/${groupId}/requests/${userId}/accept`,
    );
  },

  rejectRequest: async (groupId: string, userId: string) => {
    await api.patch(
      `/nutritionist/groups/${groupId}/requests/${userId}/reject`,
    );
  },
};
