import { api } from "@/lib/axios/api";

export const userProgramService = {
  async getPrograms() {
    const res = await api.get("/programs");
    return res.data;
  },

  async getProgramById(programId: string) {
    const res = await api.get(`/programs/${programId}`);
    return res.data;
  },


  async getProgramDays(programId: string) {
    const res = await api.get(
      `/programs/${programId}/days`
    );
    return res.data;
  },


  async getProgramDayByNumber(
    programId: string,
    dayNumber: number
  ) {
    const res = await api.get(
      `/programs/${programId}/day/${dayNumber}`
    );
    return res.data;
  },

    async getProgramDayById(dayId: string) {
    const res = await api.get(`/program-days/${dayId}`);
    return res.data;
  }

};