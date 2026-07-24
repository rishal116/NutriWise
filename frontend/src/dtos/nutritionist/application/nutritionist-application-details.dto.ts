import { Language, Specialization } from "@/types/nutritionist.types";

export interface QualificationDto {
  degree: string;
  institution: string;
  year: number;
}

export interface ExperienceDto {
  role: string;
  organization: string;
  durationYears: number;
}

export interface CertificationDto {
  name: string;
  issuedBy: string;
  certificateUrl?: string;
}

export interface NutritionistApplicationDetailsDto {
  qualifications: QualificationDto[];
  specializations: Specialization[];
  experiences: ExperienceDto[];
  bio?: string;
  languages: Language[];
  resumeUrl: string;
  certifications: CertificationDto[];
}