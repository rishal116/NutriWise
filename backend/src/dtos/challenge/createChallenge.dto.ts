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

  duration: number | string;

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

  tags?: string[] | string;

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  media?: IChallengeMedia[] | string;

  // Frontend sends this separately
  mediaMetadata?: string;

  rewards?: IChallengeReward | string;

  templateId?: string;

  isPremium?: boolean | string;
  isFeatured?: boolean | string;
  isTrending?: boolean | string;
  isRecommended?: boolean | string;

  visibility?: "public" | "private";

  benefits?: string[] | string;
  equipmentNeeded?: string[] | string;

  seoTitle?: string;
  seoDescription?: string;
}
