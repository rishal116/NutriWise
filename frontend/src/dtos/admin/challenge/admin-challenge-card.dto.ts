import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
} from "@/types/admin/challenge/challenge.types";

export interface AdminChallengeCardDTO {
  id: string;

  title: string;
  description: string;

  thumbnailUrl?: string;

  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;

  durationDays: number;

  status: ChallengeStatus;

  createdAt: string;
  updatedAt: string;
}
