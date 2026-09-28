export interface CreateReviewDTO {
  userPlanId: string;
  rating: number;
  review?: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  review?: string;
}

export interface ReviewResponseDTO {
  id: string;
  userId: string;
  nutritionistId: string;
  userPlanId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicReviewUserDTO {
  id: string;
  fullName: string;
  profileImage?: string;
}

export interface PublicReviewResponseDTO {
  id: string;
  user: PublicReviewUserDTO;
  rating: number;
  review?: string;
  createdAt: string;
}