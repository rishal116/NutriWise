import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "@/types/admin/challenge/challenge.types";

export interface CreateChallengeDTO {
  title: string;
  description: string;
  instructions?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
}