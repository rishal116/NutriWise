import {api} from "@/lib/axios/api";

export interface TodayTasksResponse {
  program: any;
  programDay: any;
  taskLog: any;
}

export const taskService = {
  async getTodayTasks(): Promise<TodayTasksResponse> {
    const res = await api.get("/tasks/today");
    return res.data.data;
  },

  async updateTodayTasks(payload: any) {
    const res = await api.post("/tasks/today", payload);
    return res.data.data;
  },
};