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

export interface IChallengeMedia {
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}

export interface IChallengeReward {
  xpPoints: number;
  badge?: string;
  certificate?: boolean;
  premiumUnlock?: boolean;
}

export interface CreateChallengeDTO {
  // STEP 1
  title: string;
  shortDescription?: string;
  description?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid";

  // STEP 2
  category?:
    | "weight_loss"
    | "muscle_gain"
    | "mental_wellness"
    | "hydration"
    | "productivity"
    | "custom";
  customCategory?: string;

  tags?: string[];

  // STEP 3

  isPremium?: boolean;

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  media?: IChallengeMedia[];

  // STEP 4
  rewards?: IChallengeReward;

  // STEP 5

  templateId?: string;

  // STEP 6
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  visibility?: "public" | "private";

  benefits?: string[];
  equipmentNeeded?: string[];

  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateChallengeDTO {
  // STEP 1
  title?: string;
  shortDescription?: string;
  description?: string;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  type?: "fitness" | "nutrition" | "mental" | "hybrid";

  // STEP 2
  category?:
    | "weight_loss"
    | "muscle_gain"
    | "mental_wellness"
    | "hydration"
    | "productivity"
    | "custom";
  customCategory?: string;
  tags?: string[];

  // STEP 3

  isPremium?: boolean;
  price?: number;

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  media?: IChallengeMedia[];

  // STEP 4
  rewards?: IChallengeReward;

  // STEP 5

  templateId?: string;

  // STEP 6
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  visibility?: "public" | "private";

  benefits?: string[];
  equipmentNeeded?: string[];

  seoTitle?: string;
  seoDescription?: string;
}
