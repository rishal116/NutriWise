import { Types } from "mongoose";

export interface TaskMediaDTO {
  type: "image" | "video";
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

export interface CreateTaskDTO {
  challengeId: Types.ObjectId | string;
  dayNumber: number;
  order?: number;
  type: "fitness" | "nutrition" | "mental" | "recovery" | "productivity";
  title: string;
  shortDescription?: string;
  description?: string;
  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";
  targetValue?: number;
  minimumValue?: number;
  maximumValue?: number;
  isOptional?: boolean;
  isLocked?: boolean;
  category?: "strength" | "cardio" | "hydration" | "diet" | "mindfulness" | "sleep" | "focus" | "general";
  coverImage?: string;
  media?: TaskMediaDTO[];
  instructionSteps?: TaskInstructionStepDTO[];
  estimatedDurationMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  aiTips?: string[];
  safetyWarnings?: string[];
  status?: "draft" | "published" | "archived";
}

