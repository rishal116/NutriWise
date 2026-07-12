import { Gender } from "../../../enums/userRole.enum";


export interface GetUserProfileDto {
  profileImage?: string;

  fullName: string;
  username: string;
  email: string;

  phone?: string;
  gender?: Gender;
  birthDate?: Date;

  activeRole: UserRole;

  createdAt: Date;
}