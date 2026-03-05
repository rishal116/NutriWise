import { api } from "@/lib/axios/api";

export const programDayService = {
  async getProgramDays(programId: string) {
    const res = await api.get(`/nutritionist/programs/${programId}/days`);
    return res.data;
  },

  async getProgramDayById(dayId: string) {
    const res = await api.get(`/nutritionist/program-days/${dayId}`);
    return res.data;
  },

  async createProgramDay(programId: string, payload: any) {
    const res = await api.post(`/nutritionist/programs/${programId}/days`, payload);
    return res.data;
  },

  async updateProgramDay(dayId: string, payload: any) {
    const res = await api.patch(`/nutritionist/program-days/${dayId}`, payload);
    return res.data;
  },

  async deleteProgramDay(dayId: string) {
    const res = await api.delete(`/nutritionist/program-days/${dayId}`);
    return res.data;
  },
};