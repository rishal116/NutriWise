import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
  ChallengeType,
} from "../../../models/challenge.model";

export interface AdminChallengeListItemDTO {
  challengeId: string;

  title: string;
  description: string;
  thumbnailUrl?: string;

  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  accessType: ChallengeAccessType;

  durationDays: number;

  startDate: Date;
  endDate: Date;

  status: ChallengeStatus;

  rewardPoints: number;

  createdAt: Date;
  updatedAt: Date;
}
