
import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface AdminNutritionistApplicationListItemDto {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  profileImage?: string;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}
