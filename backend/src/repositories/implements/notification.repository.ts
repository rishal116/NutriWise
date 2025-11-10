import { Model, Types } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IAdminNotificationRepository } from "../interfaces/INotificationRepository";
import { INotification, NotificationModel } from "../../models/notification.model";
import { NotificationDto } from "../../dtos/common/notification.dto";

export class AdminNotificationRepository
  extends BaseRepository<INotification>
  implements IAdminNotificationRepository
{
  constructor(model: Model<INotification> = NotificationModel) {
    super(model);
  }
async createNotification(data: NotificationDto): Promise<void> {
    await this._model.create(data);
  }

  async getAllNotifications() {
    return this._model.find();
  }

  async markNotificationRead(id: string) {
    await this._model.findByIdAndUpdate(id, { read: true });
  }

  async deleteNotification(id: string) {
    await this._model.findByIdAndDelete(id);
  }

  async approveNutritionist(userId: string) {
    await this._model.db.collection("users").updateOne(
      { _id: new Types.ObjectId(userId) },
      { $set: { nutritionistStatus: "approved" } }
    );
  }

  async rejectNutritionist(userId: string, reason: string) {
    await this._model.db.collection("users").updateOne(
      { _id: new Types.ObjectId(userId) },
      { $set: { nutritionistStatus: "rejected", rejectionReason: reason } }
    );
  }
}
