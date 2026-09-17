import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "@/types/challenge/challenge.types";

import { UserChallengeStatus } from "@/types/user/challenge/user-challenge.types";

export interface UserChallengeCardDTO {
  id: string;
  challengeId: string;
  title: string;
  thumbnailUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  status: UserChallengeStatus;
  currentDay: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: Date;
  completedAt?: Date;
}