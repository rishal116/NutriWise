import { adminApi } from "@/lib/axios/adminApi";
import { UpdateChallengeDTO } from "@/types/challenge";

export interface Challenge {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid";
  createdAt: string;
}

export interface PaginatedChallenges {
  data: Challenge[];
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
  ): Promise<PaginatedChallenges> => {
    const res = await adminApi.get("/admin/challenges", {
      params: { page, limit },
    });

    return res.data;
  },
  // GET ONE
  getChallengeById: async (id: string) => {
    const res = await adminApi.get(`/admin/challenges/${id}`);
    return res.data;
  },

  // UPDATE
  updateChallenge: async (id: string, data: UpdateChallengeDTO) => {
    const res = await adminApi.put(`/admin/challenges/${id}`, data);
    return res.data;
  },

  // DELETE
  deleteChallenge: async (id: string) => {
    const res = await adminApi.delete(`/admin/challenges/${id}`);
    return res.data;
  },

  // PUBLISH
  publishChallenge: async (id: string) => {
    const res = await adminApi.patch(`/admin/challenges/${id}/publish`);
    return res.data;
  },
};
