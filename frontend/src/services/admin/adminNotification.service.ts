import {NotificationResponseDTO } from "@/dtos/admin/notificationList.dto";
import { adminApi } from "@/lib/axios/adminApi";

export const adminNotificationService = {
  getAllNotifications: async (page = 1, limit = 2, search = ""): Promise<NotificationResponseDTO> => {
    const res = await adminApi.get(`/admin/notifications`, {
      params: { page, limit, search }
    });
    return res.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await adminApi.patch(`/admin/notifications/read/${notificationId}`);
    return res.data;
  },
};
