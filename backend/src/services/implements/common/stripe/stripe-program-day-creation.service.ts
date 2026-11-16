import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";

import type { INutritionistPlanDayRepository } from "../../../../repositories/interfaces/nutritionist/INutriPlanDayRepository";
import type { IUserProgramDayRepository } from "../../../../repositories/interfaces/user/program/IUserProgramDayRepository";

import type { IStripeProgramDayCreationService } from "../../../interfaces/common/stripe/IStripeProgramDayCreationService";
import type { StripeProgramDayCreationDTO } from "../../../../dtos/common/stripe/stripe-program-day-creation.dto";

import { StripeProgramDayMapper } from "../../../../mappers/common/stripe/stripe-program-day.mapper";

import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";

@injectable()
export class StripeProgramDayCreationService implements IStripeProgramDayCreationService {
  constructor(
    @inject(TYPES.INutriPlanDayRepository)
    private readonly nutritionistPlanDayRepository: INutritionistPlanDayRepository,

    @inject(TYPES.IUserProgramDayRepository)
    private readonly userProgramDayRepository: IUserProgramDayRepository,
  ) {}

  async create(params: StripeProgramDayCreationDTO): Promise<void> {
    const { planId, userProgramId, session } = params;

    const templateDays = await this.nutritionistPlanDayRepository.find(
      { planId },
      session,
    );

    if (templateDays.length === 0) {
      throw new CustomError(
        "Cannot provision a program without template days.",
        StatusCode.BAD_REQUEST,
      );
    }

    const userProgramDays = StripeProgramDayMapper.toUserProgramDays(
      templateDays,
      userProgramId,
    );

    await this.userProgramDayRepository.createMany(userProgramDays, session);
  }
}
