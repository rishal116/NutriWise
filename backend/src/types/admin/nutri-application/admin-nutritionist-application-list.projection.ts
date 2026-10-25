import type { Types } from "mongoose";
import type { ApplicationStatus } from "../../nutritionist.types";

export interface IAdminNutritionistApplicationListProjection {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  profileImage?: string;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}
