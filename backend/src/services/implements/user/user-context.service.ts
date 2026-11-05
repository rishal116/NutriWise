import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { IUserContextService } from "../../interfaces/user/IUserContextService";
import type { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import type { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutriProfileRepository";

import { CustomError } from "../../../utils/customError";

import { GetMeResponseDto } from "../../../dtos/user/auth/get-me-response.dto";

@injectable()
export class UserContextService implements IUserContextService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private readonly nutritionistRepository: INutritionistProfileRepository,
  ) {}

  async getMe(userId: string): Promise<GetMeResponseDto> {
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

    const nutritionist =
      await this.nutritionistRepository.findByUserId(userId);

    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage ?? null,
      activeRole: user.activeRole,
      roles: user.roles,
      isProfileCompleted: user.isProfileCompleted,
      nutritionistStatus: nutritionist?.applicationStatus ?? null,
    };
  }
}