import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

export const PUBLIC_CHALLENGE_SORT_OPTIONS = [
  "newest",
  "oldest",
] as const;

export type PublicChallengeSort =
  (typeof PUBLIC_CHALLENGE_SORT_OPTIONS)[number];

export interface PublicChallengeListQuery {
  search?: string;
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  accessType?: ChallengeAccessType;
  sortBy: PublicChallengeSort;
  cursor?: string;
  limit: number;
}