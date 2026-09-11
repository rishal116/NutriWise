import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeSortBy,
  ChallengeStatus,
} from "@/types/admin/challenge/challenge.types";

export interface AdminChallengeListQueryDTO {
  search?: string;

  category?: ChallengeCategory;

  difficulty?: ChallengeDifficulty;

  accessType?: ChallengeAccessType;

  status?: ChallengeStatus;

  sortBy?: ChallengeSortBy;

  cursor?: string;

  limit?: number;
}
