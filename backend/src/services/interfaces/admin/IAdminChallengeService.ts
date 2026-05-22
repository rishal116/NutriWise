import { IChallenge } from "../../../models/challenge.model";
import { ChallengeFilters } from "../../../dtos/challenge/challenge-filter.dto";
import { ChallengeListDTO } from "../../../dtos/challenge/challenge-list.dto";
import { ChallengeResponseDTO } from "../../../dtos/challenge/challengeResponse.dto";
import {
  CreateChallengeDTO,
  ChallengeUploadFiles,
  UpdateChallengeDTO, 
} from "../../../dtos/challenge/challenge.dto";

export interface IAdminChallengeService {
  createChallenge(
    dto: CreateChallengeDTO,
    files: ChallengeUploadFiles,
    adminId: string,
  ): Promise<IChallenge>;

  getChallenges(
    page: number,
    limit: number,
    filters: ChallengeFilters,
  ): Promise<{
    data: ChallengeListDTO[];
    total: number;
  }>;

  getChallengeById(id: string): Promise<ChallengeResponseDTO | null>;

  updateChallenge(
    id: string,
    dto: UpdateChallengeDTO,
  ): Promise<IChallenge | null>;

  deleteChallenge(id: string): Promise<void>;

  publishChallenge(id: string): Promise<IChallenge | null>;
}
