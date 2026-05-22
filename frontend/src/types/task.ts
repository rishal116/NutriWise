export interface ChallengeTaskMediaDTO {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
  file?: File;
  thumbnailFile?: File;
}

export interface ChallengeTaskInstructionStepDTO {
  stepNumber: number;
  title: string;
  description: string;
  media?: ChallengeTaskMediaDTO[];
}

export interface CreateChallengeTaskDTO {
  challengeId: string;
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
  media?: ChallengeTaskMediaDTO[];
  instructionSteps?: ChallengeTaskInstructionStepDTO[];
  estimatedDurationMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  aiTips?: string[];
  safetyWarnings?: string[];
  status?: "draft" | "published" | "archived";
}

export interface UpdateChallengeTaskDTO extends Partial<CreateChallengeTaskDTO> {
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface ChallengeTaskListDTO {
  id: string;
  challengeId: string;
  dayNumber: number;
  order: number;
  title: string;
  slug: string;
  type: "fitness" | "nutrition" | "mental" | "recovery" | "productivity";
  status: "draft" | "published" | "archived";
  category: "strength" | "cardio" | "hydration" | "diet" | "mindfulness" | "sleep" | "focus" | "general";
  difficulty: "easy" | "medium" | "hard";
  shortDescription?: string;
  coverImage?: string;
  estimatedDurationMinutes?: number;
  isOptional: boolean;
  isLocked: boolean;
  completionCount: number;
  averageCompletionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeTaskResponseDTO {
  _id: string;
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
  media: ChallengeTaskMediaDTO[];
  instructionSteps: ChallengeTaskInstructionStepDTO[];
  estimatedDurationMinutes?: number;
  difficulty: "easy" | "medium" | "hard";
  aiTips: string[];
  safetyWarnings: string[];
  completionCount: number;
  averageCompletionRate: number;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IChallengeTask = ChallengeTaskResponseDTO;
