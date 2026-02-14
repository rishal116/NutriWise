interface Experience {
  role: string;
  organization: string;
  years: number;
}

export interface NutritionistProfileDTO {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  qualifications: string[];
  specializations: string[];
  experiences: Experience[];
  bio?: string;
  languages: string[];
  availabilityStatus: string;
  certifications?: string[];
  totalExperienceYears?: number;
  country: string;
  rating?: number;
  totalPeopleCoached:number;
  nutritionistStatus:string;
}