import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";

import { NotificationResponseDTO } from "../../../dtos/notification/notification-response.dto";
import { NotificationMapper } from "../../../mappers/notification/notification.mapper";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { INotificationService } from "../../interfaces/common/INotificationService";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { NotificationQueryDTO } from "../../../dtos/notification/notification-query.dto";
import { CreateNotificationDTO } from "../../../dtos/notification/create-notification.dto";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import logger from "../../../utils/logger";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepo: INotificationRepository,
    @inject(TYPES.ISocketService)
    private readonly _socketService: ISocketService,
    @inject(TYPES.IUserRepository)
    private readonly _userRepo: IUserRepository,
  ) {}

  async getNotifications(
    recipientId: string,
    query: NotificationQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NotificationResponseDTO>> {
    const validatedQuery = await validateDto(NotificationQueryDTO, query);

    const result = await this._notificationRepo.getNotifications(
      recipientId,
      validatedQuery,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((notification) =>
        NotificationMapper.toResponseDTO(notification),
      ),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this._notificationRepo.getUnreadCount(recipientId);
  }

  async markNotificationRead(
    notificationId: string,
    recipientId: string,
  ): Promise<void> {
    await this._notificationRepo.markAsRead(notificationId, recipientId);
    try {
      const count = await this._notificationRepo.getUnreadCount(recipientId);
      this._socketService.emitNotificationCount(recipientId, count);
    } catch (error) {
      logger.warn("Failed to emit notification count on markRead", {
        recipientId,
        error,
      });
    }
  }

  async markAllNotificationsRead(recipientId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(recipientId);
    try {
      this._socketService.emitNotificationCount(recipientId, 0);
    } catch (error) {
      logger.warn("Failed to emit notification count on markAllRead", {
        recipientId,
        error,
      });
    }
  }

  async createNotification(
    dto: CreateNotificationDTO,
  ): Promise<NotificationResponseDTO> {
    const recipientIdStr = dto.recipientId.toString();
    const recipientObjectId = new Types.ObjectId(recipientIdStr);
    const senderObjectId = dto.senderId
      ? new Types.ObjectId(dto.senderId.toString())
      : null;

    let senderName: string | null = null;
    if (senderObjectId) {
      const sender = await this._userRepo.findById(senderObjectId);
      if (sender) {
        senderName = sender.fullName;
      }
    }

    const dataMap = dto.data
      ? dto.data instanceof Map
        ? dto.data
        : new Map(Object.entries(dto.data))
      : undefined;

    const created = await this._notificationRepo.create({
      recipientId: recipientObjectId,
      senderId: senderObjectId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      ...(dataMap !== undefined && { data: dataMap }),
    });

    const unreadCount = await this._notificationRepo.getUnreadCount(
      recipientIdStr,
    );

    const serializedData = dto.data
      ? dto.data instanceof Map
        ? Object.fromEntries(dto.data)
        : dto.data
      : undefined;

    const responseDTO: NotificationResponseDTO = {
      id: created._id.toString(),
      type: created.type,
      title: created.title,
      message: created.message,
      ...(serializedData !== undefined && { data: serializedData }),
      isRead: created.isRead,
      createdAt: created.createdAt,
      senderName,
    };

    try {
      this._socketService.emitNewNotification(
        recipientIdStr,
        responseDTO,
        unreadCount,
      );
    } catch (error) {
      logger.warn("Failed to emit new notification socket event", {
        recipientId: recipientIdStr,
        error,
      });
    }

    return responseDTO;
  }
}

