import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

import { UserChallengeStatus } from "../../../models/userChallenge.model";

export interface UserChallengeListItem {
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
