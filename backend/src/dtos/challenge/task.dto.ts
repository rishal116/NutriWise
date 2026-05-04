import mongoose from "mongoose";

export interface TaskMediaDTO {
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}

export interface TaskInstructionStepDTO {
  stepNumber: number;
  title: string;
  description: string;
  media?: TaskMediaDTO[];
}

export interface TaskRewardDTO {
  xpPoints?: number;
  badge?: string;
}

export interface CreateTaskDTO {
  challengeId: mongoose.Types.ObjectId;
  dayNumber: number;
  type: "fitness" | "nutrition" | "mental";
  title: string;

  order?: number;

  shortDescription?: string;
  description?: string;

  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";
  targetValue?: number;
  minimumValue?: number;
  maximumValue?: number;

  isOptional?: boolean;
  isLocked?: boolean;

  category?:
    | "strength"
    | "cardio"
    | "hydration"
    | "diet"
    | "mindfulness"
    | "sleep"
    | "focus"
    | "general";

  coverImage?: string;
  media?: TaskMediaDTO[];

  instructionSteps?: TaskInstructionStepDTO[];

  estimatedDurationMinutes?: number;

  difficulty?: "easy" | "medium" | "hard";

  rewards?: TaskRewardDTO;

  aiTips?: string[];
  safetyWarnings?: string[];
}
