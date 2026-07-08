import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface AdminNutritionistApplicationListQueryDto {
  skip: number;
  limit: number;
  search?: string;
  applicationStatus?: ApplicationStatus;
  sortBy?: "createdAt" | "fullName";
  sortOrder?: "asc" | "desc";
}
