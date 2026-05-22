import { TaskMediaDTO, TaskInstructionStepDTO } from "./createTask.dto";

export interface TaskResponseDTO {
  id: string;
  challengeId: string;
  dayNumber: number;
  order: number;
  title: string;
  slug: string;
  type: "fitness" | "nutrition" | "mental" | "recovery" | "productivity";
  status: "draft" | "published" | "archived";
  shortDescription?: string;
  description?: string;
  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";
  targetValue?: number;
  minimumValue?: number;
  maximumValue?: number;
  isOptional: boolean;
  isLocked: boolean;
  category: "strength" | "cardio" | "hydration" | "diet" | "mindfulness" | "sleep" | "focus" | "general";
  coverImage?: string;
  media: TaskMediaDTO[];
  instructionSteps: TaskInstructionStepDTO[];
  estimatedDurationMinutes?: number;
  difficulty: "easy" | "medium" | "hard";
  aiTips: string[];
  safetyWarnings: string[];
  completionCount: number;
  averageCompletionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

