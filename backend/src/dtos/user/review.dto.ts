
export interface ReviewResponseDTO {
  id: string;
  userId: string;
  userName?: string;           
  userProfileImage?: string;  
  nutritionistId?: string;
  planId?: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

export interface SubmitReviewDTO {
  userId: string;
  nutritionistId: string;
  planId?: string;
  rating: number;
  review?: string;
}