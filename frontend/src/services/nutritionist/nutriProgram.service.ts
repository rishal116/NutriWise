import { api } from "@/lib/axios/api";

// ================= PROGRAMS =================

export const nutriProgramService = {
  // 🔹 Get all programs
  async getPrograms() {
    const res = await api.get("/nutritionist/programs");
    return res.data;
  },

  // 🔹 Get single program
  async getProgramById(programId: string) {
    const res = await api.get(`/nutritionist/programs/${programId}`);
    return res.data;
  },

  // 🔹 Create program (optional if you have)
  async createProgram(payload: any) {
    const res = await api.post("/nutritionist/programs", payload);
    return res.data;
  },

  // 🔹 Update program status (ACTIVE / PAUSED / COMPLETED)
  async updateProgramStatus(programId: string, status: string) {
    const res = await api.patch(
      `/nutritionist/programs/${programId}/status`,
      { status }
    );
    return res.data;
  },

  // ================= PROGRAM DAYS =================

  // 🔹 Get all days of a program
  async getProgramDays(programId: string) {
    const res = await api.get(
      `/nutritionist/programs/${programId}/days`
    );
    return res.data;
  },

  // 🔹 Get specific day by number
  async getProgramDayByNumber(
    programId: string,
    dayNumber: number
  ) {
    const res = await api.get(
      `/nutritionist/programs/${programId}/day/${dayNumber}`
    );
    return res.data;
  },

  // 🔹 Create day tasks
  async createProgramDay(payload: any) {
    const res = await api.post(
      "/nutritionist/program-days",
      payload
    );
    return res.data;
  },

  // 🔹 Update day tasks
  async updateProgramDay(dayId: string, payload: any) {
    const res = await api.put(
      `/nutritionist/program-days/${dayId}`,
      payload
    );
    return res.data;
  },

  // 🔹 Delete day (optional but useful)
  async deleteProgramDay(dayId: string) {
    const res = await api.delete(
      `/nutritionist/program-days/${dayId}`
    );
    return res.data;
  },
};