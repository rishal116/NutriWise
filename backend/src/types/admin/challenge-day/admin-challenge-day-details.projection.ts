import type {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "../../../models/challengeDay.model";

export interface AdminChallengeActivityProjection {
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
}

export interface AdminChallengeDayDetailsProjection {
  id: string;
  challengeId: string;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: AdminChallengeActivityProjection[];
}
