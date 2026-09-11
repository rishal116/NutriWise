import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "@/types/admin/challenge/challenge.types";

export interface UpdateChallengeDTO {
  title?: string;

  description?: string;

  instructions?: string;

  thumbnailUrl?: string;

  category?: ChallengeCategory;

  difficulty?: ChallengeDifficulty;

  accessType?: ChallengeAccessType;

  durationDays?: number;
}
