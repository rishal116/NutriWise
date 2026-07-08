import { Types } from "mongoose";
import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface AdminNutritionistApplicationListItemDto {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  profileImage?: string;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}
