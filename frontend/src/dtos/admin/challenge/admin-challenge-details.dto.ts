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
  coverImageUrl?: string;

  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  status: ChallengeStatus;

  createdAt: string;
  updatedAt: string;
}