import {
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeAccessType,
} from "../../../models/challenge.model";

export interface PublicChallengeSectionQuery {
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  accessType?: ChallengeAccessType;
  limit: number;
}