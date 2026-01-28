import { injectable } from "inversify";
import { BaseRepository } from "../../implements/common/base.repository";
import { IHealthDetailsRepository } from "../../interfaces/user/IHealthDetailsRepository";
import { HealthDetailsModel, IHealthDetails } from "../../../models/clientProfile.model";
import { Types } from "mongoose";

@injectable()
export class HealthDetailsRepository extends BaseRepository<IHealthDetails> 
implements IHealthDetailsRepository {
    constructor() {
        super(HealthDetailsModel);
    }
    
    async findByUserId(userId: string): Promise<IHealthDetails | null> {
        return this._model.findOne({ userId });
    }
    
    async upsertByUserId(userId: string,data: Partial<IHealthDetails>): Promise<IHealthDetails> {
        return this._model.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true, upsert: true }
        );
    }
      async updateByUserId(userId: string,data: Partial<IHealthDetails>): Promise<IHealthDetails | null> {
        return this._model.findOneAndUpdate(
          { userId: new Types.ObjectId(userId) },
          { $set: data },
          { new: true, runValidators: true }
        ).exec();
      }
      
      async getProfileImageByUserId(userId: string): Promise<{ profileImage?: string } | null> {
        return this._model.findOne({ userId }, { profileImage: 1, _id: 0 }).lean();
      }
}
