import { injectable, inject } from "inversify";
import { IUserPlanService } from "../../interfaces/user/IUserPlanService";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/IUserPlanRepository";
import { TYPES } from "../../../types/types";
import { UserPlanMapper } from "../../../mapper/user/userPlan.mapper";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { Types } from "mongoose";

@injectable()
export class UserPlanService implements IUserPlanService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private _userPlanRepo: IUserPlanRepository,

    @inject(TYPES.IUserProgramRepository)
    private _userProgramRepo: IUserProgramRepository,
  ) {}

  async getMyPlans(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const [plans, programs] = await Promise.all([
      this._userPlanRepo.findByUserId(userObjectId),
      this._userProgramRepo.findByUser(userObjectId),
    ]);

    return plans.map((plan) => {
      const program = programs.find(
        (p) => p.planId.toString() === plan.planId._id.toString(),
      );

      return UserPlanMapper.toListDTO(plan, program);
    });
  }

  async getPlanById(planId: string, userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const planObjectId = new Types.ObjectId(planId);

    const plan = await this._userPlanRepo.findOnePopulated({
      _id: planObjectId,
      userId: userObjectId,
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    const programs = await this._userProgramRepo.findByUserAndPlan(
      userObjectId,
      plan.planId._id,
    );

    const program = programs?.[0];

    return UserPlanMapper.toDetailDTO(plan, program);
  }
}
