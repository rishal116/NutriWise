export type CreationMethod = "manual" | "ai";

export type AIInput = {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
};

export interface IChallengeMedia {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}


export interface ChallengeUploadFiles {
  coverImage?: Express.Multer.File[];
  bannerImage?: Express.Multer.File[];
  introVideo?: Express.Multer.File[];
  mediaFiles?: Express.Multer.File[];
}

export interface CreateChallengeDTO {
  title: string;
  shortDescription?: string;
  description?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid" | "productivity";
  category?: "weight_loss" | "muscle_gain" | "mental_wellness" | "hydration" | "productivity" | "custom";
  customCategory?: string;
  tags?: string[];
  isPremium?: boolean;
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;
  media?: IChallengeMedia[];
  templateId?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  visibility?: "public" | "private";
  benefits?: string[];
  equipmentNeeded?: string[];
  estimatedCaloriesBurn?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateChallengeDTO extends Partial<CreateChallengeDTO> {
  status?: "draft" | "published" | "archived";
  isDeleted?: boolean;
  deletedAt?: Date | null;
}
