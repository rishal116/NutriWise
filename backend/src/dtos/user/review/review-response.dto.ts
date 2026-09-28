export class ReviewResponseDTO {
  id!: string;
  userId!: string;
  nutritionistId!: string;
  userPlanId!: string;
  rating!: number;
  review?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class PublicReviewResponseDTO {
  id!: string;

  user!: {
    id: string;
    fullName: string;
    profileImage?: string;
  };

  rating!: number;
  review?: string;
  createdAt!: Date;
}
