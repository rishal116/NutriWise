import { injectable, inject } from "inversify";
import { TYPES } from "../../types/types";
import { IAdminNotificationService } from "../interfaces/INotificationService";
import { IAdminNotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IUserRepository } from "../../repositories/interfaces/user/IUserRepository";
import { NotificationDto } from "../../dtos/common/notification.dto";

@injectable()
export class AdminNotificationService implements IAdminNotificationService {
  constructor(
    @inject(TYPES.IAdminNotificationRepository)
    private _notificationRepo: IAdminNotificationRepository,

    @inject(TYPES.IUserRepository)
    private _userRepo: IUserRepository
  ) {}

  async getAllNotifications(): Promise<any[]> {
    return this._notificationRepo.getAllNotifications(); 
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await this._notificationRepo.markNotificationRead(notificationId);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this._notificationRepo.deleteNotification(notificationId);
  }

  async approveNutritionist(userId: string): Promise<void> {
    await this._userRepo.updateById(userId, { nutritionistStatus: "approved" });

    const notification: NotificationDto = {
      title: "Your profile has been approved",
      message: "Congratulations! Your nutritionist profile is now approved.",
      type: "success",
      userId,      
    };
    await this._notificationRepo.createNotification(notification);
  }

  async rejectNutritionist(userId: string, reason: string): Promise<void> {
    await this._userRepo.updateById(userId, { nutritionistStatus: "rejected" });

    const notification: NotificationDto = {
      title: "Your profile has been rejected",
      message: `Your nutritionist profile was rejected. Reason: ${reason}`,
      type: "error",
      userId,
    };
    await this._notificationRepo.createNotification(notification);
  }
}
