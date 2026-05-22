export interface TaskListDTO {
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
  createdAt: Date;
  updatedAt: Date;
}

