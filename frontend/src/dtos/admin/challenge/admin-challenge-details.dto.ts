import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
} from "@/types/admin/challenge/challenge.types";

export interface AdminChallengeDetailsDTO {
  id: string;

  title: string;
  description: string;

  instructions?: string;
  thumbnailUrl?: string;

  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;

  durationDays: number;

  status: ChallengeStatus;

  createdBy: string;

  createdAt: string;
  updatedAt: string;
}
