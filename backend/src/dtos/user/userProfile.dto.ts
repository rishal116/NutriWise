import { Gender } from "../../models/clientProfile.model";

export interface UserProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  gender: Gender | null;
  birthdate: string | null; 
}

export interface UpdateUserProfileDto {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?:Gender;
  birthdate?:Date;
}

export interface UserProfileImage {
    profileImage?:string;
}