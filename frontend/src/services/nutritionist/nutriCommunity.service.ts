import { api } from "@/lib/axios/api";

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

    return res.data.data;
  },
};