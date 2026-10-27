import { clientApi } from "@/lib/axios/clientApi";
import { NOTIFICATION_ROUTES } from "@/routes/common/notification.routes";

import type { NotificationResponseDTO } from "@/dtos/notification/notification-response.dto";
import type { NotificationQueryDTO } from "@/dtos/notification/notification-query.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

function requireData<T>(response: ApiResponseDTO<T>): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "The server returned no data");
  }

  return response.data;
}

export const notificationService = {
  async getNotifications(
    query: NotificationQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NotificationResponseDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NotificationResponseDTO>>
    >(NOTIFICATION_ROUTES.LIST, {
      params: query,
    });

    return requireData(res.data);
  },

  async getUnreadCount(): Promise<number> {
    const res = await clientApi.get<ApiResponseDTO<{ count: number }>>(
      NOTIFICATION_ROUTES.UNREAD_COUNT,
    );

    return requireData(res.data).count;
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await clientApi.patch<ApiResponseDTO<undefined>>(
      NOTIFICATION_ROUTES.MARK_AS_READ(notificationId),
    );
  },

  async markAllNotificationsRead(): Promise<void> {
    await clientApi.patch<ApiResponseDTO<undefined>>(
      NOTIFICATION_ROUTES.MARK_ALL_AS_READ,
    );
  },
};
