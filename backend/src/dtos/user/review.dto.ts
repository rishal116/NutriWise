export interface SubmitReviewDTO {
  userId: string;
  nutritionistId: string;
  rating: number;
  review?: string;
  planId?: string;
}

export interface ReviewResponseDTO {
  id: string;
  userId: string;
  nutritionistId?: string;
  rating: number;
  review?: string;
  planId?: string;
  createdAt: Date;
}