import { NotificationResponseDTO } from "@/dtos/admin/notificationList.dto";
import { clientApi } from "@/lib/axios/clientApi";

export const adminNotificationService = {
  getAllNotifications: async (
    page = 1,
    limit = 2,
    search = "",
  ): Promise<NotificationResponseDTO> => {
    const res = await clientApi.get(`/admin/notifications`, {
      params: { page, limit, search },
    });
    return res.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await clientApi.patch(`/admin/notifications/read/${notificationId}`);
    return res.data;
  },
};
