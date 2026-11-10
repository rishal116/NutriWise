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
  thumbnailUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  goals: string[];
  benefits: string[];
  tags: string[];
}
