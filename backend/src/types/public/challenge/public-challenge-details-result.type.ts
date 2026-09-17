import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

export interface PublicChallengeDetailsResult {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  coverImageUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
}