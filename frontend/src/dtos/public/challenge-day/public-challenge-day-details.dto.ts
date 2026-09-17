export interface PublicChallengeActivityDTO {
  id: string;
  type: string;
  title: string;
  description?: string;
  instructions?: string;
  valueType: string;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  imageUrl?: string;
  videoUrl?: string;
  isRequired: boolean;
  order: number;
}

export interface PublicChallengeDayDetailsDTO {
  id: string;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: PublicChallengeActivityDTO[];
}