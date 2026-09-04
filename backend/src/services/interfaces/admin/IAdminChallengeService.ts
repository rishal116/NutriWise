import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";

import { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";

import { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";

import { CreateChallengeDTO } from "../../../dtos/admin/challenge/create-challenge.dto";

import { UpdateChallengeDTO } from "../../../dtos/admin/challenge/update-challenge.dto";

export interface IAdminChallengeService {
  createChallenge(
    data: CreateChallengeDTO,
    adminId: string,
  ): Promise<AdminChallengeDetailsDTO>;

  browseChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeCardDTO>>;

  getChallenge(challengeId: string): Promise<AdminChallengeDetailsDTO>;

  updateChallenge(
    challengeId: string,
    data: UpdateChallengeDTO,
  ): Promise<AdminChallengeDetailsDTO>;

  deleteChallenge(challengeId: string): Promise<void>;

  publishChallenge(challengeId: string): Promise<AdminChallengeDetailsDTO>;
}
