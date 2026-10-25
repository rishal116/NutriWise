import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { TYPES } from "../../../../types/types";
import type { IOnboardingService } from "../../../interfaces/user/IOnboardingService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";
import type { IHealthDetailsRepository } from "../../../../repositories/interfaces/user/account/IHealthDetailsRepository";
import type { IHealthProgressRepository } from "../../../../repositories/interfaces/user/account/IHealthProgressRepository";
import { CompleteProfileDto } from "../../../../dtos/user/onboarding/complete-profile.dto";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";

@injectable()
export class OnboardingService implements IOnboardingService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.IHealthDetailsRepository)
    private readonly _healthDetailsRepository: IHealthDetailsRepository,

    @inject(TYPES.IHealthProgressRepository)
    private readonly _healthProgressRepository: IHealthProgressRepository,
  ) {}

  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<void> {
    await validateDto(CompleteProfileDto, dto);

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    const birthDate = new Date(dto.birthDate);

    if (birthDate.getTime() > Date.now()) {
      throw new CustomError(
        "Birth date cannot be in the future",
        StatusCode.BAD_REQUEST,
      );
    }

    const bmi = Number((dto.weightKg / (dto.heightCm / 100) ** 2).toFixed(2));

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const user = await this._userRepository.findById(userId);

        if (!user) {
          throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        await this._userRepository.updateById(
          userId,
          {
            gender: dto.gender,
            birthDate,
            isProfileCompleted: true,
          },
          session,
        );

        await this._healthDetailsRepository.upsertByUserId(
          userId,
          {
            heightCm: dto.heightCm,
            weightKg: dto.weightKg,
            activityLevel: dto.activityLevel,
            dietType: dto.dietType,
            goal: dto.goal,
            ...(dto.targetWeightKg !== undefined && {
              targetWeightKg: dto.targetWeightKg,
            }),
            ...(dto.preferredTimeline !== undefined && {
              preferredTimeline: dto.preferredTimeline,
            }),
          },
          session,
        );

        await this._healthProgressRepository.upsertDailyProgress(
          {
            userId,
            date: new Date(),
            weightKg: dto.weightKg,
            bmi,
          },
          session,
        );
      });
    } finally {
      await session.endSession();
    }

    logger.info("User profile completed successfully", { userId });
  }
}
