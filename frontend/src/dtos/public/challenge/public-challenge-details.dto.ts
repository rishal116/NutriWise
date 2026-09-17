import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "@/types/public/challenge/challenge.types";

export interface PublicChallengeDayDTO {
  id: string;
  dayNumber: number;
  title?: string;
  description?: string;
}

export type PublicChallengeParticipationStatus =
  "not_joined" | "active" | "completed" | "abandoned";

export interface PublicChallengeParticipationDTO {
  userChallengeId?: string;
  status: PublicChallengeParticipationStatus;
  currentDay?: number;
  progressPercentage?: number;
  currentStreak?: number;
  longestStreak?: number;
}

export interface PublicChallengeDetailsDTO {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  coverImageUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  days: PublicChallengeDayDTO[];
  participation: PublicChallengeParticipationDTO;
}
