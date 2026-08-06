import { Types } from "mongoose";
import { INutritionistPlan } from "../../../../models/nutritionistPlan.model"; 
import { IBaseRepository } from "../../common/IBaseRepository"; 

export interface INutritionistPlanBrowsingRepository 
  extends IBaseRepository<INutritionistPlan> {

  findByNutritionistId(
    nutritionistId: Types.ObjectId,
  ): Promise<INutritionistPlan[]>;

  findBySlug(
    slug: string,
  ): Promise<INutritionistPlan | null>;
}