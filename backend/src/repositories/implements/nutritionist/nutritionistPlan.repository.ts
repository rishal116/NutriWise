import { BaseRepository } from "../base.repository";
import { INutritionistPlanRepository } from "../../interfaces/nutritionist/INutritionistPlanRepository";
import { PlanModel, IPlan } from "../../../models/nutritionistPlan.model";
import { Types } from "mongoose";

export class NutritionistPlanRepository extends BaseRepository<IPlan> implements INutritionistPlanRepository {
  constructor() {
    super(PlanModel);
  }
  
  create(payload: Partial<IPlan>) {
    console.log("repository");
    
    return this._model.create(payload);
  }
  
  updateById(id: string, payload: Partial<IPlan>) {
    return this._model
      .findByIdAndUpdate(id, payload, { new: true })
      .lean<IPlan>() as any;
  }

  findById(id: string) {
    return this._model.findById(id).lean<IPlan | null>();
  }

  findMany(filter: Partial<IPlan>) {
    return this._model.find(filter).lean<IPlan[]>();
  }

}
