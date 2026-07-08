import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IAdminUserService } from "../../interfaces/admin/IAdminUserService";
import { IAdminUserRepository } from "../../../repositories/interfaces/admin/IAdminUserRepository";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";
import logger from "../../../utils/logger";
import { UserMapper } from "../../../mapper/admin/user/user.mapper";

@injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @inject(TYPES.IAdminUserRepository)
    private readonly _adminUserRepository: IAdminUserRepository,
  ) {}

  async getUsers(query: AdminUserListQueryDto): Promise<{
    data: AdminUserListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { users, total } = await this._adminUserRepository.getUsers(query);
    const data = UserMapper.toAdminUserListItemDtos(users);
    return {
      data,
      total,
      skip: query.skip,
      limit: query.limit,
      hasMore: query.skip + data.length < total,
    };
  }

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    logger.info("Updating user block status", {
      userId,
      isBlocked,
    });
    await this._adminUserRepository.updateBlockStatus(userId, isBlocked);
  }
}
