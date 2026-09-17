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

export class UserChallengeActivityDTO {
  id!: string;
  type!: ChallengeActivityType;
  title!: string;
  description?: string;
  instructions?: string;
  valueType!: ChallengeActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  imageUrl?: string;
  videoUrl?: string;
  isRequired!: boolean;
  order!: number;
  completed!: boolean;

  constructor(data: UserChallengeActivityDTO) {
    Object.assign(this, data);
  }
}

export class UserChallengeDayDTO {
  id!: string;
  dayNumber!: number;
  title?: string;
  description?: string;
  activities!: UserChallengeActivityDTO[];

  constructor(data: UserChallengeDayDTO) {
    Object.assign(this, data);
  }
}

export class UserChallengeProgressDTO {
  id!: string;
  challengeDayId!: string;
  activityId!: string;
  completedAt!: Date;

  constructor(data: UserChallengeProgressDTO) {
    Object.assign(this, data);
  }
}

export class UserChallengeDetailsDTO {
  id!: string;
  status!: UserChallengeStatus;
  joinedAt!: Date;
  startedAt!: Date;
  currentDay!: number;
  progressPercentage!: number;
  currentStreak!: number;
  longestStreak!: number;
  completedAt?: Date;

  challenge!: {
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

  days!: UserChallengeDayDTO[];
  progress!: UserChallengeProgressDTO[];

  constructor(data: UserChallengeDetailsDTO) {
    Object.assign(this, data);
  }
}
