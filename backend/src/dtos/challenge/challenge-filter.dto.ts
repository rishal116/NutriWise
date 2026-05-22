export type ChallengeSortBy =
  | "latest"
  | "oldest"
  | "title";

export type ChallengeStatus =
  | "draft"
  | "published"
  | "archived";

export type ChallengeType =
  | "fitness"
  | "nutrition"
  | "mental"
  | "hybrid"
  | "productivity";

export type ChallengeDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type ChallengeCategory =
  | "weight_loss"
  | "muscle_gain"
  | "mental_wellness"
  | "hydration"
  | "productivity"
  | "custom";

export type ChallengeVisibility =
  | "public"
  | "private";

export interface ChallengeFilters {
  search?: string;
  status?: ChallengeStatus;
  type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
  category?: ChallengeCategory;
  visibility?: ChallengeVisibility;
  isPremium?: boolean;
  sortBy?: ChallengeSortBy;
}