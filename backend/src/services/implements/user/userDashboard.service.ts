import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IUserDashboardService } from "../../interfaces/user/IUserDashboardService";
import { IUserDashboardRepository } from "../../../repositories/interfaces/user/account/IUserDashboardRepository";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";

import { toUserDashboardOverviewDTO } from "../../../mappers/user/dashboard/user-dashboard-overview.mapper";

@injectable()
export class UserDashboardService implements IUserDashboardService {
  constructor(
    @inject(TYPES.IUserDashboardRepository)
    private readonly _userDashboardRepository: IUserDashboardRepository,
  ) {}

  async getOverview(userId: string): Promise<UserDashboardOverviewDTO> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    const overview = await this._userDashboardRepository.getOverview(userId);

    if (!overview) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    return toUserDashboardOverviewDTO(overview);
  }
}
