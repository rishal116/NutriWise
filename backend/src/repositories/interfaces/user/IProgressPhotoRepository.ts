import { Types } from "mongoose";
import { IProgressPhoto } from "../../../models/progressPhoto.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IProgressPhotoRepository extends IBaseRepository<IProgressPhoto> {
    findByUser(userId: Types.ObjectId): Promise<IProgressPhoto[]>;
    findByProgram(userProgramId: Types.ObjectId): Promise<IProgressPhoto[]>;
    deleteById(photoId: Types.ObjectId): Promise<void>;
}