import type {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

export type ExistingMedia = {
  imageUrl?: string;
  videoUrl?: string;
};

export type ActivityFormValue = {
  id?: string;
  type: ChallengeActivityType;
  title: string;
  description: string;
  instructions: string;
  valueType: ChallengeActivityValueType;
  targetValue?: number;
  unit: string;
  estimatedDurationMinutes?: number;
  isRequired: boolean;
  configuration: Record<string, unknown>;
  imageFile: File | null;
  videoFile: File | null;
  existingImageUrl?: string;
  existingVideoUrl?: string;
  removeImage: boolean;
  removeVideo: boolean;
};

export interface ChallengeDayFormProps {
  mode: "create" | "edit";
  challengeId: string;
  dayId?: string;
  initialValues?: {
    dayNumber?: number;
    title?: string;
    description?: string;
    activities?: Array<Partial<ActivityFormValue> & ExistingMedia>;
  };
}
