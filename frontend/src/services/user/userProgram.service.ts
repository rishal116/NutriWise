import { api } from "@/lib/axios/api";

export const userProgramService = {
  async getProgramDays(programId: string) {
    const res = await api.get(`/programs/${programId}/days`);
    return res.data;
  },

  async getProgramDayByNumber(programId: string, dayNumber: number) {
    const res = await api.get(`/programs/${programId}/day/${dayNumber}`);
    return res.data;
  },

};
