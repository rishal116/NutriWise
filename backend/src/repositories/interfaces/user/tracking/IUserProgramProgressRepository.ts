import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import { IUserProgramProgress } from "../../../../models/userProgramProgress.model";

export interface IUserProgramProgressRepository extends IBaseRepository<IUserProgramProgress> {
  createWithSession(
    data: Partial<IUserProgramProgress>,
    session: ClientSession,
  ): Promise<IUserProgramProgress>;

  findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserProgramProgress | null>;

  findByUser(userId: string | Types.ObjectId): Promise<IUserProgramProgress[]>;

  updateProgress(
    userProgramId: string | Types.ObjectId,
    update: Partial<IUserProgramProgress>,
  ): Promise<IUserProgramProgress | null>;
}
