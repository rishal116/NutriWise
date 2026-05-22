export interface ChallengeListDTO {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid" | "productivity";
  category: string;
  duration: number;
  status: "draft" | "published" | "archived";
  isPremium: boolean;
  isFeatured: boolean;
  isTrending: boolean;    
  isRecommended: boolean;
  coverImage?: string;
  totalEnrollments: number;
  averageRating: number;
  createdAt: Date;
}
