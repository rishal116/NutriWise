import { Types } from "mongoose";
import {
  INutritionistPlan,
  NutritionistPlanModel,
} from "../../../models/nutritionistPlan.model";

import { BaseRepository } from "../common/base.repository";
import { INutritionistPlanBrowsingRepository } from "../../interfaces/user/INutriPlanBrowsingRepository";

export class NutritionistPlanBrowsingRepository
  extends BaseRepository<INutritionistPlan>
  implements INutritionistPlanBrowsingRepository {

  constructor() {
    super(NutritionistPlanModel);
  }

  async findByNutritionistId(
    nutritionistId: Types.ObjectId,
  ): Promise<INutritionistPlan[]> {
    return this._model.find({
      nutritionistId,
      status: "published",
      isDeleted: false,
    });
  }

  async findBySlug(
    slug: string,
  ): Promise<INutritionistPlan | null> {
    return this._model.findOne({
      slug,
      status: "published",
      isDeleted: false,
    });
  }
}