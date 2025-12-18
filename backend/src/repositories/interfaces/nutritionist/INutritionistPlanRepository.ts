import { IPlan } from "../../../models/nutritionistPlan.model";

export interface INutritionistPlanRepository {
  create(payload: Partial<IPlan>): Promise<IPlan>;
  updateById(id: string, payload: Partial<IPlan>): Promise<IPlan>;
  findById(id: string): Promise<IPlan | null>;
  findMany(filter: Partial<IPlan>): Promise<IPlan[]>;
}
