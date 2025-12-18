import { api } from "@/lib/axios/api";
import {NotificationResponseDTO } from "@/dtos/admin/notificationList.dto";

export const adminNotificationService = {
  getAllNotifications: async (page = 1, limit = 2, search = ""): Promise<NotificationResponseDTO> => {
    const res = await api.get(`/admin/notifications`, {
      params: { page, limit, search }
    });
    return res.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await api.patch(`/admin/notifications/read/${notificationId}`);
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
