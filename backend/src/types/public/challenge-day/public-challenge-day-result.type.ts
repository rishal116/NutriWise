import {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "../../../models/challengeDay.model";

export interface PublicChallengeDayListItem {
  id: string;
  dayNumber: number;
  title?: string;
  description?: string;
}

export interface PublicChallengeActivityResult {
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

export interface PublicChallengeDayResult extends PublicChallengeDayListItem {
  activities: PublicChallengeActivityResult[];
}
