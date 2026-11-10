
import type { CreateChallengeDTO } from "@/dtos/admin/challenge/create-challenge.dto";

export interface ChallengeFormProps {
  mode: "create" | "edit";
  challengeId?: string;
  initialValues?: Partial<CreateChallengeDTO> & {
    thumbnailUrl?: string;
  };
}

export interface ChallengeFormState {
  title: string;
  description: string;
  instructions: string;
  category: CreateChallengeDTO["category"] | "";
  difficulty: CreateChallengeDTO["difficulty"] | "";
  accessType: CreateChallengeDTO["accessType"] | "";
  durationDays: number;
  goals: string[];
  benefits: string[];
  tags: string[];
}

export interface ImageConfig {
  label: string;
  description: string;
  aspectRatio: number;
  aspectLabel: string;
  outputWidth: number;
  outputHeight: number;
  accept: string;
  maxFileSizeMB: number;
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  existingUrl: string | null;
  removed: boolean;
}

export interface CropTarget {
  file: File;
}
