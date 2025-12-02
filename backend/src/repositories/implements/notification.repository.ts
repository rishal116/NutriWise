import { Model } from "mongoose";
import { BaseRepository } from "../base.repository";
import { INotification, NotificationModel } from "../../models/notification.model";
import { NotificationDto, NotificationQuery } from "../../dtos/common/notification.dto";
import { INotificationRepository } from "../interfaces/INotificationRepository";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
  constructor(model: Model<INotification> = NotificationModel) {
    super(model);
  }

  async createNotification(data: NotificationDto): Promise<void> {
    await this._model.create(data);
  }
  
  async getNotifications(query: NotificationQuery) {
    const { page = 1, limit = 10, search = "", receiverId, recipientType } = query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }
    if (receiverId) filter.receiverId = receiverId;
    if (recipientType) filter.recipientType = recipientType;
    const total = await this._model.countDocuments(filter);
    const data = await this._model
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    return { data, total };
  }

  async markNotificationRead(id: string) {
    await this._model.findByIdAndUpdate(id, { read: true });
  }

  async markAllRead(receiverId: string, recipientType: "user" | "admin") {
    await this._model.updateMany(
      { receiverId, recipientType },
      { read: true }
    );
  }

  async deleteNotification(id: string) {
    await this._model.findByIdAndDelete(id);
  }
}
