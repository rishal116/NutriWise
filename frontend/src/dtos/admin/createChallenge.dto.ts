export interface IChallengeMedia {
  type: "image" | "video" | "audio" | "pdf";

  file?: File;
  previewUrl?: string;

  url?: string; // final backend URL only

  thumbnailFile?: File;
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

  // Uploaded URLs
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  // Raw files for submission
  coverImageFile?: File;
  bannerImageFile?: File;
  introVideoFile?: File;

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