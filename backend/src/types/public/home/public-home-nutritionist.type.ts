export interface PublicHomeNutritionist {
  id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  bio?: string;
  qualifications: string[];
  specializations: string[];
  coachLevel?: string;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}
