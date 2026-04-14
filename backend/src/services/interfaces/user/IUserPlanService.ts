import { UserPlanListDTO } from "../../../dtos/user/userPlanList.dto";
import { UserPlanDetailDTO } from "../../../dtos/user/userPlanDetail.dto";

export interface IUserPlanService {
  getMyPlans(userId: string): Promise<UserPlanListDTO[]>;

  getPlanById(planId: string, userId: string): Promise<UserPlanDetailDTO>;
}
