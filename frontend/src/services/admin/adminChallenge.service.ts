import { adminApi } from "@/lib/axios/adminApi";
import {
  Challenge,
  ChallengeListItem,
  ChallengeFilters,
} from "@/types/challenge";

export interface PaginatedChallenges {
  success: boolean;
  data: ChallengeListItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  nextPage: number | null;
}

export const adminChallengeService = {
  createChallenge: async (formData: FormData) => {
    const res = await adminApi.post("/admin/challenges/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  getChallenges: async (
    page: number = 1,
    limit: number = 10,
    filters?: ChallengeFilters,
  ): Promise<PaginatedChallenges> => {
    const res = await adminApi.get(
      "/admin/challenges",
      {
        params: {
          page,
          limit,
          ...filters,
        },
      },
    );

    return res.data;
  },

  getChallengeById: async (
    id: string,
  ): Promise<{
    success: boolean;
    data: Challenge;
  }> => {
    const res = await adminApi.get(`/admin/challenges/${id}`);

    return res.data;
  },

  updateChallenge: async (
    id: string,
    data: FormData,
  ) => {
    const res = await adminApi.put(
      `/admin/challenges/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  },

  deleteChallenge: async (id: string) => {
    const res = await adminApi.delete(`/admin/challenges/${id}`);

    return res.data;
  },

  publishChallenge: async (id: string) => {
    const res = await adminApi.patch(`/admin/challenges/${id}/publish`);

    return res.data;
  },
};
