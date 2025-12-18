import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistPlanService } from "../../interfaces/nutritionist/INutritionistPlanService";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { IPlan } from "../../../models/nutritionistPlan.model";
import { CreatePlanDto,UpdatePlanDto,} from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { Types } from "mongoose";
import { PlanDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";



@injectable()
export class NutritionistPlanService implements INutritionistPlanService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private _repo: INutritionistPlanRepository
  ) {}
  
  async createPlan(nutritionistId: string,dto: CreatePlanDto): Promise<IPlan> {
    console.log("service");
    
    const planData: Partial<IPlan> = {
      nutritionistId: nutritionistId as any,
      title: dto.title,
      category: dto.category,
      durationInDays: dto.durationInDays,
      price: dto.price,
      description: dto.description,
      status: "draft",
      approvalStatus: "pending",
    };
    return this._repo.create(planData);
  }
  
  async updatePlan(nutritionistId: string,planId: string,data: UpdatePlanDto) {
    const plan = await this._repo.findById(planId);
    if (!plan || plan.nutritionistId.toString() !== nutritionistId) {
      throw new Error("Plan not found or unauthorized");
    }
    return this._repo.updateById(planId, data);
  }
  
  async getPlansByNutritionist(nutritionistId: string) {
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);
    const plans = await this._repo.findMany({
      nutritionistId: nutritionistObjectId,
    });
    const planDTOs: PlanDTO[] = plans.map((plan) => ({
      id: plan._id.toString(),
      title: plan.title,
      category: plan.category,
      durationInDays: plan.durationInDays,
      price: plan.price,
      description: plan.description,
      status: plan.status,
      approvalStatus: plan.approvalStatus as "pending" | "approved" | "rejected",
      rejectionReason: plan.rejectionReason || null,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
    return planDTOs;
  }

}

