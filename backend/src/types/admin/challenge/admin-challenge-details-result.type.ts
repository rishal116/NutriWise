import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
} from "../../../models/challenge.model";

export interface AdminChallengeDetailsResult {
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

  createdAt: Date;
  updatedAt: Date;
}
