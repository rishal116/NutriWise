import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";
import type { INotificationRepository } from "../../interfaces/common/INotificationRepository";
import {
  NotificationModel,
  type INotification,
} from "../../../models/notification.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { NotificationQueryDTO } from "../../../dtos/notification/notification-query.dto";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { INotificationProjection } from "../../../types/notification/notification.projection";

export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async getNotifications(
    recipientId: string,
    query: NotificationQueryDTO,
  ): Promise<CursorPaginationResult<INotificationProjection>> {
    const { limit = 10, cursor, isRead } = query;

    const filter: FilterQuery<INotification> = {
      recipientId: new Types.ObjectId(recipientId),
    };

    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (!decodedCursor || typeof decodedCursor.value !== "string") {
        throw new Error("Invalid cursor");
      }

      const cursorDate = new Date(decodedCursor.value);

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid cursor");
      }

      const cursorId = new Types.ObjectId(decodedCursor.id);

      filter.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: cursorId },
        },
      ];
    }

    const documents = await this._model
      .find(filter)
      .select("_id type title message data isRead createdAt senderId")
      .populate({
        path: "senderId",
        select: "fullName",
        match: { deletedAt: null },
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMore = documents.length > limit;
    const items = documents.slice(0, limit);

    const projectedItems: INotificationProjection[] = items.map((item) => ({
      _id: item._id.toString(),
      type: item.type,
      title: item.title,
      message: item.message,
      ...(item.data !== undefined && {
        data:
          item.data instanceof Map ? Object.fromEntries(item.data) : item.data,
      }),
      isRead: item.isRead,
      createdAt: item.createdAt,
      senderName:
        item.senderId &&
        typeof item.senderId === "object" &&
        "fullName" in item.senderId
          ? String(item.senderId.fullName)
          : null,
    }));

    const lastItem = items[items.length - 1];

    return {
      items: projectedItems,
      hasMore,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt.toISOString(),
              id: lastItem._id.toString(),
            })
          : null,
    };
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this._model
      .countDocuments({
        recipientId: new Types.ObjectId(recipientId),
        isRead: false,
      })
      .exec();
  }

  async markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<boolean> {
    const result = await this._model
      .updateOne(
        {
          _id: notificationId,
          recipientId: new Types.ObjectId(recipientId),
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const result = await this._model
      .updateMany(
        {
          recipientId: new Types.ObjectId(recipientId),
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
      )
      .exec();

    return result.modifiedCount;
  }
}
