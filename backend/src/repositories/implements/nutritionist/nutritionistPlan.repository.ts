import { BaseRepository } from "../common/base.repository";
import { INutritionistPlanRepository } from "../../interfaces/nutritionist/INutritionistPlanRepository";
import { PlanModel, IPlan } from "../../../models/nutritionistPlan.model";
import { Types } from "mongoose";
import { FilterQuery } from "mongoose";

export class NutritionistPlanRepository
  extends BaseRepository<IPlan>
  implements INutritionistPlanRepository {

  constructor() {
    super(PlanModel);
  }

  create(payload: Partial<IPlan>) {
    return this._model.create(payload);
  }
  
  updateById(id: string, payload: Partial<IPlan>) {
    return this._model.findByIdAndUpdate(new Types.ObjectId(id), payload, { new: true, runValidators: true })
    .lean<IPlan>() as any;
  }
  findById(id: string) {
    return this._model.findById(id).lean<IPlan | null>();
  }

  findMany(filter: Partial<IPlan>) {
    return this._model.find(filter).lean<IPlan[]>().sort({createdAt:-1});
  }

  findByNutritionistId(nutritionistId: string) {
    return this._model
      .find({ nutritionistId: new Types.ObjectId(nutritionistId) ,
        status: "published",
      })
      .lean<IPlan[]>();
  }

  count(filter: FilterQuery<IPlan>): Promise<number> {
    return this._model.countDocuments(filter);
  }
}
