import { clientApi } from "@/lib/axios/clientApi";

export const userProgramService = {
  async getProgramDays(programId: string) {
    const res = await clientApi.get(`/programs/${programId}/days`);
    return res.data;
  },

  async getProgramDayByNumber(programId: string, dayNumber: number) {
    const res = await clientApi.get(`/programs/${programId}/day/${dayNumber}`);
    return res.data;
  },

};
