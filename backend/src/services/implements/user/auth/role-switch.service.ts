import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { IRoleSwitchService } from "../../../interfaces/user/auth/IRoleSwitchService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";

import { CustomError } from "../../../../utils/customError";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { generateTokens } from "../../../../utils/token.util";

import { SwitchRoleDto } from "../../../../dtos/user/auth/switch-role.dto";

@injectable()
export class RoleSwitchService implements IRoleSwitchService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async switchRole(
    userId: string,
    dto: SwitchRoleDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const validatedDto = await validateDto(SwitchRoleDto, dto);

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID.", StatusCode.BAD_REQUEST);
    }

    const user = await this.userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new CustomError("User not found.", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    if (!user.roles.includes(validatedDto.role)) {
      throw new CustomError(
        "You do not have access to this role.",
        StatusCode.FORBIDDEN,
      );
    }

    await this.userRepository.updateById(userId, {
      activeRole: validatedDto.role,
    });

    const { accessToken, refreshToken } = generateTokens(
      userId,
      validatedDto.role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}