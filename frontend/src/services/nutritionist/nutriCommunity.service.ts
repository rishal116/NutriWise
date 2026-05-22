import { api } from "@/lib/axios/api";
import { Group, GroupPagination } from "@/dtos/nutritionist/group.dto";

export const groupService = {
  createGroup: async (data: {
    title: string;
    description?: string;
    isPublic?: boolean;
  }) => {
    const res = await api.post("/nutritionist/groups", data);
    return res.data.data;
  },

  getMyGroups: async (params: {
    limit: number;
    cursor?: {
      lastMessageAt: string;
      id: string;
    };
  }) => {
    const res = await api.get("/nutritionist/my-groups", {
      params: {
        limit: params.limit,
        lastMessageAt: params.cursor?.lastMessageAt,
        cursorId: params.cursor?.id,
      },
    });

    return res.data as {
      success: boolean;
      data: Group[];
      pagination: GroupPagination;
    };
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
