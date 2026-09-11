import {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

export interface CreateChallengeActivityDTO {
  type: ChallengeActivityType;

  title: string;

  description?: string;

  instructions?: string;

  valueType: ChallengeActivityValueType;

  targetValue?: number;

  unit?: string;

  estimatedDurationMinutes?: number;

  isRequired?: boolean;

  order?: number;

  configuration?: Record<string, unknown>;
}