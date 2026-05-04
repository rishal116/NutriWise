
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
  title: string;
  shortDescription?: string;
  description?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid";
  category?:
    | "weight_loss"
    | "muscle_gain"
    | "mental_wellness"
    | "hydration"
    | "productivity"
    | "custom";
  customCategory?: string;
  tags?: string[];
  isPremium?: boolean;
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;
  media?: IChallengeMedia[];
  rewards?: IChallengeReward;
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
  title?: string;
  shortDescription?: string;
  description?: string;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  type?: "fitness" | "nutrition" | "mental" | "hybrid";
  category?:
    | "weight_loss"
    | "muscle_gain"
    | "mental_wellness"
    | "hydration"
    | "productivity"
    | "custom";
  customCategory?: string;
  tags?: string[];
  method?: CreationMethod;
  aiInput?: AIInput;
  isPremium?: boolean;
  price?: number;
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;
  media?: IChallengeMedia[];
  rewards?: IChallengeReward;
  templateId?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  visibility?: "public" | "private";
  benefits?: string[];
  equipmentNeeded?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export type CreationMethod = "manual" | "ai";

export type AIInput = {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
};