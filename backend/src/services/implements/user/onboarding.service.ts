import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IOnboardingService } from "../../interfaces/user/IOnboardingService";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/account/IHealthDetailsRepository";
import { CompleteProfileDto } from "../../../dtos/user/onboarding/complete-profile.dto";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class OnboardingService implements IOnboardingService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.IHealthDetailsRepository)
    private _healthDetailsRepository: IHealthDetailsRepository,
  ) {}

  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<void> {
    await validateDto(CompleteProfileDto, dto);

    const user = await this._userRepository.findById(userId);

    if (!user) {
      logger.warn("Profile completion attempted for non-existent user", {
        userId,
      });

      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    await this._userRepository.updateById(userId, {
      gender: dto.gender,
      birthDate: new Date(dto.birthDate),
      isProfileCompleted: true,
    });

    await this._healthDetailsRepository.upsertByUserId(userId, {
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      activityLevel: dto.activityLevel,
      dietType: dto.dietType,
      goal: dto.goal,
      targetWeightKg: dto.targetWeightKg,
      preferredTimeline: dto.preferredTimeline,
    });

    logger.info("User profile completed successfully", {
      userId,
    });
  }
}
