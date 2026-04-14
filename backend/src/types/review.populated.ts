interface IUserBasic {
  _id: string;
  fullName: string;
  profileImage?: string;
}

export interface IReviewPopulated {
  _id: string;
  user: IUserBasic;           // populated user
  nutritionist: string;
  userPlan?: string;
  rating: number;
  review?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}