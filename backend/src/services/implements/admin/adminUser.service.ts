import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { IAdminUserService } from "../../interfaces/admin/IAdminUserService";

import { IAdminUserRepository } from "../../../repositories/interfaces/admin/IAdminUserRepository";

import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";

import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import logger from "../../../utils/logger";

import { UserMapper } from "../../../mappers/admin/user/user.mapper";

import { Types } from "mongoose";

import { NotificationType } from "../../../models/notification.model";

import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";

@injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @inject(TYPES.IAdminUserRepository)
    private readonly _adminUserRepository: IAdminUserRepository,

    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminUserListItemDto>> {
    logger.info("Fetching admin users", {
      query,
    });

    const result = await this._adminUserRepository.getUsers(query);

    const items = result.items.map((user) =>
      UserMapper.toAdminUserListItemDto(user),
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    logger.info("Updating user block status", {
      userId,
      isBlocked,
    });

    await this._adminUserRepository.updateBlockStatus(userId, isBlocked);

    await this._notificationRepository.create({
      recipientId: new Types.ObjectId(userId),

      type: isBlocked ? NotificationType.WARNING : NotificationType.SUCCESS,

      title: isBlocked ? "Account Blocked" : "Account Unblocked",

      message: isBlocked
        ? "Your account has been blocked. Please contact support if you believe this is a mistake."
        : "Your account has been unblocked. You can now access your account.",
    });
  }
}
