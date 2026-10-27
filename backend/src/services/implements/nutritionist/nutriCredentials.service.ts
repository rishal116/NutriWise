import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { UserRole } from "../../../enums/user.enum";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import type { NutritionistCredentialsDTO } from "../../../dtos/nutritionist/profile/nutritionist-credentials.dto";
import type { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import type { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutriProfileRepository";

import { NutritionistCredentialsMapper } from "../../../mappers/nutritionist/profile/nutritionist-credentials.mapper";

@injectable()
export class NutritionistCredentialsService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private readonly nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}

  async getCredentials(
    userId: string,
  ): Promise<NutritionistCredentialsDTO> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError(
        "Invalid nutritionist user ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findById(userId);

    if (
      !user ||
      user.deletedAt ||
      user.isBlocked ||
      !user.roles.includes(UserRole.NUTRITIONIST)
    ) {
      throw new CustomError(
        "Nutritionist not found",
        StatusCode.NOT_FOUND,
      );
    }

    const profile =
      await this.nutritionistProfileRepository.findApprovedByUserId(userId);

    if (!profile) {
      throw new CustomError(
        "Nutritionist credentials not found",
        StatusCode.NOT_FOUND,
      );
    }

    return NutritionistCredentialsMapper.toDTO(user, profile);
  }
}