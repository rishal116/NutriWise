import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
  ChallengeType,
  ChallengeValueType,
} from "../../../models/challenge.model";

export interface AdminChallengeDetailsDTO {
  id: string;

  title: string;
  description: string;
  instructions?: string;
  thumbnailUrl?: string;

  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  accessType: ChallengeAccessType;
  valueType: ChallengeValueType;

  durationDays: number;

  targetValue?: number;
  targetUnit?: string;
  targetCount?: number;

  startDate: Date;
  endDate: Date;

  rewardPoints: number;
  badgeId?: string;

  status: ChallengeStatus;

  createdBy: string;

  createdAt: Date;
  updatedAt: Date;
}
