import { IChallenge } from "../../../models/challenge.model";
import { UpdateChallengeDTO } from "../../../dtos/challenge/challenge.dto";

import {
  CreateChallengeDTO,
  ChallengeUploadFiles,
} from "../../../dtos/challenge/createChallenge.dto";

export interface IAdminChallengeService {
  createChallenge(
    dto: CreateChallengeDTO,
    files: ChallengeUploadFiles,
    adminId: string,
  ): Promise<IChallenge>;

  getChallenges(
    page: number,
    limit: number,
  ): Promise<{ data: IChallenge[]; total: number }>;

  getChallengeById(id: string): Promise<IChallenge | null>;

  updateChallenge(
    id: string,
    dto: UpdateChallengeDTO,
  ): Promise<IChallenge | null>;

  deleteChallenge(id: string): Promise<void>;

  publishChallenge(id: string): Promise<IChallenge | null>;

}
