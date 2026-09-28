import { Types } from "mongoose";

export interface IUserBasic {
  _id: Types.ObjectId;
  fullName: string;
  profileImage?: string;
}

export interface IReviewPopulated {
  _id: Types.ObjectId;
  user: IUserBasic;
  nutritionist: Types.ObjectId;
  userPlan: Types.ObjectId;
  rating: number;
  review?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
