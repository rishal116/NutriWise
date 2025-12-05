import { api } from "@/lib/axios/api";

export const nutritionistAvailabilityService = {
  /* -------------------- Fetch -------------------- */
  getAvailability: async () => {
    return api.get("/nutritionist/availability"); // GET all availability
  },

  /* -------------------- Save all -------------------- */
  saveAvailability: async (payload: any) => {
    return api.post("/nutritionist/availability", payload); // POST save all
  },

  /* -------------------- Weekly slot edit -------------------- */
  updateWeeklySlot: async (day: string, slotId: string, start: string, end: string) => {
    return api.put(`/nutritionist/availability/weekly/${day}/${slotId}`, { start, end });
  },

  deleteWeeklySlot: async (day: string, slotId: string) => {
    return api.delete(`/nutritionist/availability/weekly/${day}/${slotId}`);
  },

  /* -------------------- Special date -------------------- */
  addSpecialDate: async (date: string) => {
    return api.post("/nutritionist/availability/special", { date });
  },

  updateSpecialRange: async (specialId: string, rangeId: string, start: string, end: string) => {
    return api.put(`/nutritionist/availability/special/${specialId}/range/${rangeId}`, { start, end });
  },

  deleteSpecialRange: async (specialId: string, rangeId: string) => {
    return api.delete(`/nutritionist/availability/special/${specialId}/range/${rangeId}`);
  },

  toggleBlockSpecial: async (specialId: string, blocked: boolean) => {
    return api.patch(`/nutritionist/availability/special/${specialId}/block`, { blocked });
  },

  deleteSpecialDate: async (specialId: string) => {
    return api.delete(`/nutritionist/availability/special/${specialId}`);
  },
};
