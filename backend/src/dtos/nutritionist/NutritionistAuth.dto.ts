export interface NutritionistDetailsUpdateDto {
  profileImage?: string;
  qualifications?: string[];
  specializations?: string[];
  experiences?: {
    role: string;
    organization: string;
    years: number;
  }[];
  bio?: string;
  languages?: string[];
  videoCallRate?: number;
  consultationDuration?: string;
  availabilityStatus?: "available" | "unavailable" | "busy";
  cv?: string;
  certifications?: string[];
  totalExperienceYears?: number;
  location?: {
    state: string;
    city: string;
  };
}