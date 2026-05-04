export type CreationMethod = "manual" | "ai";

export type AIInput = {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
};

export type CreateTaskDTO = {
  // REQUIRED
  dayNumber: number;
  type: "fitness" | "nutrition" | "mental";
  title: string;

  // BASIC
  description?: string;
  shortDescription?: string;

  order?: number;

  // GOAL SETTINGS
  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";
  targetValue?: number;
  minimumValue?: number;
  maximumValue?: number;

  // CLASSIFICATION
  category?:
    | "strength"
    | "cardio"
    | "hydration"
    | "diet"
    | "mindfulness"
    | "sleep"
    | "focus"
    | "general";

  difficulty?: "easy" | "medium" | "hard";

  estimatedDurationMinutes?: number;

  // OPTIONAL SETTINGS
  isOptional?: boolean;
  isLocked?: boolean;

  coverImage?: string;

  media?: {
    type: "image" | "video" | "audio" | "pdf";
    url: string;
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    duration?: number;
  }[];

  instructionSteps?: {
    stepNumber: number;
    title: string;
    description: string;
  }[];

  aiTips?: string[];
  safetyWarnings?: string[];
};