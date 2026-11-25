import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { CURRENCY } from "../../../../constants/common/currency.constants";
import type { IUserPlanRepository } from "../../../../repositories/interfaces/user/program/IUserPlanRepository";
import type { IUserProgramRepository } from "../../../../repositories/interfaces/user/program/IUserProgramRepository";
import type { IUserProgramProgressRepository } from "../../../../repositories/interfaces/user/tracking/IUserProgramProgressRepository";
import type { IConversationService } from "../../../interfaces/chat/IConversationService";
import type { IStripeProgramDayCreationService } from "../../../interfaces/common/stripe/IStripeProgramDayCreationService";
import type { IStripeProgramProvisioningService } from "../../../interfaces/common/stripe/IStripeProgramProvisioningService";
import type {
  ProvisionUserProgramDTO,
  ProvisionedUserProgramDTO,
} from "../../../../dtos/common/stripe/stripe-program-provisioning.dto";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";

@injectable()
export class StripeProgramProvisioningService implements IStripeProgramProvisioningService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private readonly userPlanRepository: IUserPlanRepository,

    @inject(TYPES.IUserProgramRepository)
    private readonly userProgramRepository: IUserProgramRepository,

    @inject(TYPES.IUserProgramProgressRepository)
    private readonly userProgramProgressRepository: IUserProgramProgressRepository,

    @inject(TYPES.IConversationService)
    private readonly conversationService: IConversationService,

    @inject(TYPES.IStripeProgramDayCreationService)
    private readonly programDayCreationService: IStripeProgramDayCreationService,
  ) {}

  async provision(
    params: ProvisionUserProgramDTO,
  ): Promise<ProvisionedUserProgramDTO> {
    const { userId, nutritionistId, planId, plan, amount, session } = params;

    const existingProgram =
      await this.userProgramRepository.findExistingPurchase(
        userId,
        planId,
        session,
      );

    if (existingProgram) {
      throw new CustomError(
        "You already have an ongoing program for this plan.",
        StatusCode.CONFLICT,
      );
    }

    const userPlan = await this.userPlanRepository.create(
      {
        userId,
        nutritionistId,
        planId,
        amount,
        currency: CURRENCY,
        planSnapshot: {
          title: plan.title,
          description: plan.description,
          specialization: plan.specialization,
          durationDays: plan.durationDays,
          price: plan.price,
          currency: CURRENCY,
          features: plan.features,
        },
      },
      session,
    );

    const userProgram = await this.userProgramRepository.create(
      {
        userId,
        nutritionistId,
        userPlanId: userPlan._id,
        planId,
        durationDays: userPlan.planSnapshot.durationDays,
        status: "preparing",
      },
      session,
    );

    await this.programDayCreationService.create({
      planId,
      userProgramId: userProgram._id,
      session,
    });

    await this.userProgramProgressRepository.create(
      {
        userId,
        userProgramId: userProgram._id,
        totalDays: userPlan.planSnapshot.durationDays,
      },
      session,
    );

    await this.conversationService.createDirectConversation(
      {
        currentUserId: userId.toString(),
        otherUserId: nutritionistId.toString(),
      },
      session,
    );

    return {
      userPlanId: userPlan._id,
      userProgramId: userProgram._id,
    };
  }
}
