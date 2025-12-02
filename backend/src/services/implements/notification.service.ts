import { injectable, inject } from "inversify";
import { TYPES } from "../../types/types";
import { INotificationService } from "../interfaces/INotificationService";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private _notificationRepo: INotificationRepository
  ) {}
  
  async getNotifications( receiverId: string, recipientType:string, page: number, limit: number, search?: string ): 
  Promise<{ notifications: any[]; total: number; currentPage: number; totalPages: number }> {
    const result = await this._notificationRepo.getNotifications({
      receiverId,
      recipientType,
      page,
      limit,
      search,
    });
    const { data, total } = result;
    const totalPages = Math.ceil(total / limit);
    return {
      notifications: data,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async markNotificationRead(id: string) {
    await this._notificationRepo.markNotificationRead(id);
  }

  async markAllNotificationsRead(receiverId: string, recipientType: "user" | "admin") {
    await this._notificationRepo.markAllRead(receiverId, recipientType);
  }

  async deleteNotification(id: string) {
    await this._notificationRepo.deleteNotification(id);
  }
}
