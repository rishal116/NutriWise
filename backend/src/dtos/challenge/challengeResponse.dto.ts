export interface ChallengeMediaDTO {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}


export interface AIInputDTO {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface ChallengeResponseDTO {
  id: string;
  isEnrolled?: boolean;
  enrollmentId?: string;
  title: string;
  shortDescription?: string;
  description?: string;
  slug: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid" | "productivity";
  creationMethod: "manual" | "ai";
  aiInput: AIInputDTO | null;
  status: "draft" | "published" | "archived";
  tags: string[];
  category: string;
  customCategory?: string;
  isPremium: boolean;
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;
  media: ChallengeMediaDTO[];
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  visibility: "public" | "private";
  isDeleted: boolean;
  deletedAt?: Date | null;
  benefits: string[];
  equipmentNeeded: string[];
  estimatedCaloriesBurn?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
