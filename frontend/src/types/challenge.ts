export interface IChallengeMedia {
  type: "image" | "video";
  url?: string;
  file?: File;
  previewUrl?: string;
  thumbnailUrl?: string;
  thumbnailFile?: File;
  title?: string;
  description?: string;
  duration?: number;
}

export type ChallengeCategory =
  | "weight_loss"
  | "muscle_gain"
  | "mental_wellness"
  | "hydration"
  | "productivity"
  | "custom";

export type ChallengeVisibility =
  | "public"
  | "private";

export type ChallengeSortBy =
  | "latest"
  | "oldest"
  | "title";

export type ChallengeStatus =
  | "draft"
  | "published"
  | "archived";

export type ChallengeType =
  | "fitness"
  | "nutrition"
  | "mental"
  | "hybrid"
  | "productivity";

export type ChallengeDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type CreationMethod =
  | "manual"
  | "ai";

export interface AIInput {
  goal: string;
  level:
    | "beginner"
    | "intermediate"
    | "advanced";
}

export interface CreateChallengeDTO {
  title: string;
  shortDescription?: string;
  description?: string;
  duration: number;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  category?: ChallengeCategory;
  customCategory?: string;
  tags?: string[];
  isPremium?: boolean;

  coverImage?: string;
  coverImageFile?: File;

  bannerImage?: string;
  bannerImageFile?: File;

  introVideo?: string;
  introVideoFile?: File;

  media?: IChallengeMedia[];

  templateId?: string;

  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;

  visibility?: ChallengeVisibility;

  benefits?: string[];
  equipmentNeeded?: string[];

  estimatedCaloriesBurn?: number;

  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateChallengeDTO
  extends Partial<CreateChallengeDTO> {
  status?: ChallengeStatus;
}

export interface Challenge {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  slug: string;

  duration: number;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;

  creationMethod: CreationMethod;
  aiInput: AIInput | null;

  status: ChallengeStatus;

  tags: string[];

  category: ChallengeCategory;
  customCategory?: string;

  isPremium: boolean;

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  media: IChallengeMedia[];

  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;

  seoTitle?: string;
  seoDescription?: string;

  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;

  visibility: ChallengeVisibility;

  benefits: string[];
  equipmentNeeded: string[];

  estimatedCaloriesBurn?: number;

  isDeleted: boolean;
  deletedAt?: string | null;

  createdBy: string;

  createdAt: string;
  updatedAt: string;
}

export interface ChallengeListItem {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;

  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  category: ChallengeCategory;

  duration: number;

  status: ChallengeStatus;

  isPremium: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;

  coverImage?: string;

  totalEnrollments: number;
  averageRating: number;

  createdAt: string;
}

export interface ChallengeFilters {
  search?: string;
  status?: ChallengeStatus;
  type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
  category?: ChallengeCategory;
  visibility?: ChallengeVisibility;
  isPremium?: boolean;
  sortBy?: ChallengeSortBy;
}