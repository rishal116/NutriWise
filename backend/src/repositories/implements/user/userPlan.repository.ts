import { BaseRepository } from "../common/base.repository";
import { IUserPlan, UserPlanModel } from "../../../models/userPlan.model";
import { IUserPlanRepository } from "../../interfaces/user/IUserPlanRepository";
import { IUserPlanPopulated } from "../../../types/userPlan.populated";

export class UserPlanRepository extends BaseRepository<IUserPlan> implements IUserPlanRepository {
    constructor() {
        super(UserPlanModel);
    }
    
    async findBySessionId(sessionId: string) {
        return this._model.findOne({ stripeSessionId: sessionId });
    }
    async findActiveByUser(userId: string) {
        return this._model.findOne({
            userId,
            status: "ACTIVE",
            endDate: { $gt: new Date() },
        });
    }
    
    async expireById(id: string) {
        await this._model.findByIdAndUpdate(id, { status: "EXPIRED" });
    }
    
    async findByUserId(userId: string): Promise<IUserPlanPopulated[]> {
        const docs = await this._model.find({ userId })
        .populate("planId")
        .populate("nutritionistId")
        .exec();
        return docs as unknown as IUserPlanPopulated[];
    }
    
    async findByNutritionistId(nutritionistId: string): Promise<IUserPlanPopulated[]> {

        
        const docs = await this._model.find({ nutritionistId })
        .populate("userId")
        .populate("planId")
        .populate("nutritionistId")
        .exec();
        return docs as unknown as IUserPlanPopulated[];
    }

async findOnePopulated(
  filter: Partial<IUserPlan>
): Promise<IUserPlanPopulated | null> {
  const doc = await this._model
    .findOne(filter)
    .populate("planId")
    .populate("nutritionistId")
    .populate("userId")
    .exec();

  return doc as unknown as IUserPlanPopulated | null;
}

}
