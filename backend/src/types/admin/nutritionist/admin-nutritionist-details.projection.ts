import { Types } from "mongoose";

import type {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "../../../types/nutritionist.types";
import type { Gender, UserRole } from "../../../enums/user.enum";

import type {
  QualificationDto,
  ExperienceDto,
  CertificationDto,
} from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

export interface IAdminNutritionistDetailsProjection {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  gender?: Gender;

  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;

  qualifications: QualificationDto[];
  experiences: ExperienceDto[];
  certifications: CertificationDto[];
  specializations: Specialization[];
  languages: Language[];
  bio?: string;
  resumeUrl: string;

  availabilityStatus: AvailabilityStatus;
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  coachLevel: CoachLevel;

  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  totalExperienceYears: number;

  createdAt: Date;
  updatedAt: Date;
}
