import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface NutritionistApplicationStatusDto {
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
}