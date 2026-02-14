import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INotificationService } from "../../interfaces/admin/INotificationService";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { NotificationDTO } from "../../../dtos/admin/notificationList.dto";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private _notificationRepo: INotificationRepository
  ) {}
  
  async getNotifications( receiverId: string, recipientType:string, page: number, limit: number, search?: string ): 
  Promise<{ notifications: NotificationDTO[]; total: number; currentPage: number; totalPages: number }> {
    const result = await this._notificationRepo.getNotifications({
      receiverId,
      recipientType,
      page,
      limit,
      search,
    });
    const { data, total } = result;
    const notifications = data.map(n => new NotificationDTO(n))
    
    const totalPages = Math.ceil(total / limit);
    return {
      notifications,
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
}
