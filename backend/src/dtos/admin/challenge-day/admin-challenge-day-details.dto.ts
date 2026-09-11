import {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "../../../models/challengeDay.model";

export interface AdminChallengeActivityDTO {
  id: string;

  type: ChallengeActivityType;

  title: string;

  description?: string;

  instructions?: string;

  valueType: ChallengeActivityValueType;

  targetValue?: number;

  unit?: string;

  estimatedDurationMinutes?: number;

  imageUrl?: string;

  videoUrl?: string;

  isRequired: boolean;

  order: number;

  configuration?: Record<string, unknown>;
}

export interface AdminChallengeDayDetailsDTO {
  id: string;

  challengeId: string;

  dayNumber: number;

  title?: string;

  description?: string;

  activities: AdminChallengeActivityDTO[];

  createdAt: Date;

  updatedAt: Date;
}
