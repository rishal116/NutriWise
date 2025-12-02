import { api } from "@/lib/axios/api";

export const adminNotificationService = {
  getAllNotifications: async (page = 1, limit = 10, search = "") => {
    const res = await api.get(`/admin/notifications`, {
      params: { page, limit, search }
    });
    return res.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await api.patch(`/admin/notifications/read/${notificationId}`);
    return res.data;
  },

  deleteNotification: async (notificationId: string) => {
    const res = await api.delete(`/admin/notifications/${notificationId}`);
    return res.data;
  },

  approveNutritionist: async (userId: string) => {
    const res = await api.patch(`/admin/nutritionist/approve/${userId}`);
    return res.data;
  },
  
  rejectNutritionist: async (userId: string, reason: string) => {
    const res = await api.patch(`/admin/nutritionist/reject/${userId}`, { reason });
    return res.data;
  },

  getNutritionistProfile: async (userId: string) => {
    const res = await api.get(`/admin/nutritionist/${userId}`);
    return res.data;
  }
};
