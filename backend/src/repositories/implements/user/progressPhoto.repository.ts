import { injectable } from "inversify";
import { Types } from "mongoose";
import {ProgressPhotoModel,IProgressPhoto,} from "../../../models/progressPhoto.model";
import { IProgressPhotoRepository } from "../../interfaces/user/IProgressPhotoRepository";
import { BaseRepository } from "../common/base.repository";

@injectable()
export class ProgressPhotoRepository extends BaseRepository<IProgressPhoto> implements IProgressPhotoRepository {
    constructor() {
        super(ProgressPhotoModel);
    }
    
    async findByUser(userId: Types.ObjectId): Promise<IProgressPhoto[]> {
        return this._model.find({ userId }).sort({ takenAt: -1 }).lean().exec();
    }
    
    async findByProgram(userProgramId: Types.ObjectId): Promise<IProgressPhoto[]> {
        return this._model.find({ userProgramId }).sort({ takenAt: -1 }).lean().exec();
    }
    
    async deleteById(photoId: Types.ObjectId): Promise<void> {
        await this._model.findByIdAndDelete(photoId);
    }
}