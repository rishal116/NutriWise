import { Gender } from "../../models/user.model";

export interface UserProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  gender?:Gender;
  birthdate?:Date;
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