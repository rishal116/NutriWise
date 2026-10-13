
export interface NutritionistCredentialsDTO {
  fullName: string;
  username: string;
  profileImage: string | null;
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  specializations: string[];
  experiences: {
    role: string;
    organization: string;
    durationYears: number;
  }[];
  bio: string | null;
  languages: string[];
  certifications: {
    name: string;
    issuedBy: string;
    certificateUrl: string;
  }[];
  totalExperienceYears: number;
  coachLevel: string;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}
