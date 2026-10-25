import {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

export interface UpdateChallengeActivityDTO {
  id?: string;
  type?: ChallengeActivityType;
  title?: string;
  description?: string;
  instructions?: string;
  valueType?: ChallengeActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  isRequired?: boolean;
  order?: number;
  removeImage?: boolean;
  removeVideo?: boolean;
}
