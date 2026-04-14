import { injectable, inject } from "inversify";
import { IAdminClientRepository } from "../../../repositories/interfaces/admin/IAdminClientRepository";
import { IAdminClientService } from "../../interfaces/admin/IAdminClientService";
import { TYPES } from "../../../types/types";
import { UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import logger from "../../../utils/logger";
import { UserMapper } from "../../../mapper/admin/user.mapper";

@injectable()
export class AdminClientService implements IAdminClientService {
  constructor(
    @inject(TYPES.IAdminClientRepository)
    private _adminClientRepository: IAdminClientRepository,
  ) {}

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedResponseDto<UserDTO>> {
    logger.info("Fetching users (admin)", {
      page,
      limit,
      search: search || null,
    });

    const skip = (page - 1) * limit;

    const { users, total } = await this._adminClientRepository.getAllUsers(
      skip,
      limit,
      search,
    );

    logger.info("Users fetched successfully", {
      count: users.length,
      total,
      page,
    });

    const userDTOs = UserMapper.toUserDTOList(users);

    return new PaginatedResponseDto<UserDTO>(userDTOs, total, page, limit);
  }

  async blockUser(userId: string): Promise<void> {
    logger.warn("Blocking user initiated", { userId });

    try {
      await this._adminClientRepository.blockUser(userId);

      logger.warn("User blocked successfully", { userId });
    } catch (error) {
      logger.error("Failed to block user", {
        userId,
        error,
      });

      throw error;
    }
  }

  async unblockUser(userId: string): Promise<void> {
    logger.warn("Unblocking user initiated", { userId });

    try {
      await this._adminClientRepository.unblockUser(userId);

      logger.info("User unblocked successfully", { userId });
    } catch (error) {
      logger.error("Failed to unblock user", {
        userId,
        error,
      });

      throw error;
    }
  }
}
