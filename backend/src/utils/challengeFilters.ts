import {
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeStatus,
  ChallengeType,
  ChallengeVisibility,
} from "../dtos/challenge/challenge-filter.dto";

export const toChallengeStatus = (
  value: unknown,
): ChallengeStatus | undefined => {
  if (
    value === "draft" ||
    value === "published" ||
    value === "archived"
  ) {
    return value;
  }

  return undefined;
};

export const toChallengeType = (
  value: unknown,
): ChallengeType | undefined => {
  if (
    value === "fitness" ||
    value === "nutrition" ||
    value === "mental" ||
    value === "hybrid" ||
    value === "productivity"
  ) {
    return value;
  }

  return undefined;
};

export const toChallengeDifficulty = (
  value: unknown,
): ChallengeDifficulty | undefined => {
  if (
    value === "easy" ||
    value === "medium" ||
    value === "hard"
  ) {
    return value;
  }

  return undefined;
};

export const toChallengeCategory = (
  value: unknown,
): ChallengeCategory | undefined => {
  if (
    value === "weight_loss" ||
    value === "muscle_gain" ||
    value === "mental_wellness" ||
    value === "hydration" ||
    value === "productivity" ||
    value === "custom"
  ) {
    return value;
  }

  return undefined;
};

export const toChallengeVisibility = (
  value: unknown,
): ChallengeVisibility | undefined => {
  if (
    value === "public" ||
    value === "private"
  ) {
    return value;
  }

  return undefined;
};