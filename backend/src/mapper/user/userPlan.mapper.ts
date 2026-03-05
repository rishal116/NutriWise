import { IUserPlanPopulated } from "../../types/userPlan.populated";
import { UserPlanResponseDTO } from "../../dtos/user/userPlan.dto";

export class UserPlanMapper {
  static toUserDTO(plan: IUserPlanPopulated): UserPlanResponseDTO {
    
    return {

      id: plan._id.toString(),

      plan: {
        id: plan.planId._id.toString(),
        title: plan.planId.title,
        price: plan.planId.price,
        durationInDays: plan.planId.durationInDays,
      },

      nutritionist: {
        id: plan.nutritionistId._id.toString(),
        name: plan.nutritionistId.fullName,
      },

      status: plan.status,
      startDate: plan.startDate,
      endDate: plan.endDate,
    };
  }

  static toUserDTOList(plans: IUserPlanPopulated[]): UserPlanResponseDTO[] {
    return plans.map(this.toUserDTO);
  }
}
