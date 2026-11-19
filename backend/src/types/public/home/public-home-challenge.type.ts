import type { ChallengeCategory } from "../../../constants/challenge/challenge-category.constants";
import type { ChallengeDifficulty } from "../../../constants/challenge/challenge-difficulty.constants";
import type { ChallengeAccessType } from "../../../constants/challenge/challenge-access-type.constants";

export interface PublicHomeChallenge {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
}