import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

import {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "../../../models/challengeDay.model";

import { UserChallengeStatus } from "../../../models/userChallenge.model";

export interface UserChallengeActivityResult {
  id: string;
  type: ChallengeActivityType;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ChallengeActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  imageUrl?: string;
  videoUrl?: string;
  isRequired: boolean;
  order: number;
}

export interface UserChallengeDayResult {
  id: string;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: UserChallengeActivityResult[];
}

export interface UserChallengeProgressResult {
  id: string;
  challengeDayId: string;
  activityId: string;
  completedAt: Date;
}

export interface UserChallengeDetailsResult {
  id: string;
  status: UserChallengeStatus;
  joinedAt: Date;
  startedAt: Date;
  currentDay: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  completedAt?: Date;

  challenge: {
    id: string;
    title: string;
    description: string;
    instructions?: string;
    coverImageUrl?: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    accessType: ChallengeAccessType;
    durationDays: number;
  };

  days: UserChallengeDayResult[];
  progress: UserChallengeProgressResult[];
}