import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";
import type { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";
import type { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";
import type { CreateChallengeDTO } from "../../../dtos/admin/challenge/create-challenge.dto";
import type { UpdateChallengeDTO } from "../../../dtos/admin/challenge/update-challenge.dto";

export interface IAdminChallengeService {
  updateChallenge(
    challengeId: string,
    data: UpdateChallengeDTO,
    thumbnailFile?: Express.Multer.File,
  ): Promise<void>;

  createChallenge(
    data: CreateChallengeDTO,
    adminId: string,
    thumbnailFile?: Express.Multer.File,
  ): Promise<void>;

  browseChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeCardDTO>>;

  getChallenge(challengeId: string): Promise<AdminChallengeDetailsDTO>;

  deleteChallenge(challengeId: string): Promise<void>;

  publishChallenge(challengeId: string): Promise<void>;
}
