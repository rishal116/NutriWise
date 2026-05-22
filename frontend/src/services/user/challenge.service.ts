import { api } from "@/lib/axios/api";
import { API_ROUTES } from "@/routes/user.routes";

export const challengeService = {
  getChallenges: async () => {
    const res = await api.get(API_ROUTES.CHALLENGES.GET_ALL);
    return res.data;
  },
  getChallengeById: async (id: string) => {
    const res = await api.get(API_ROUTES.CHALLENGES.GET_BY_ID(id));
    return res.data;
  },
  getChallengeBySlug: async (slug: string) => {
    const res = await api.get(API_ROUTES.CHALLENGES.GET_BY_SLUG(slug));
    return res.data;
  },
  joinChallenge: async (id: string) => {
    const res = await api.post(API_ROUTES.CHALLENGES.JOIN(id));
    return res.data;
  },
  getMyChallenges: async () => {
    const res = await api.get(API_ROUTES.CHALLENGES.GET_MY_CHALLENGES);
    return res.data;
  },
  getChallengeTasks: async (id: string, dayNumber?: number) => {
    const res = await api.get(API_ROUTES.CHALLENGES.GET_TASKS(id), {
      params: { dayNumber },
    });
    return res.data;
  },
  toggleTaskCompletion: async (
    challengeId: string,
    taskId: string,
    dayNumber: number,
    completed: boolean,
  ) => {
    const res = await api.post(`/challenges/${challengeId}/tasks/toggle`, {
      taskId,
      dayNumber,
      completed,
    });
    return res.data;
  },
};