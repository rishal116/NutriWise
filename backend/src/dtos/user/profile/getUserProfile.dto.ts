import { Gender } from "../../../enums/user.enum";

export interface GetUserProfileDto {
  profileImage?: string;

  fullName: string;
  email: string;

  phone?: string;
  gender?: Gender;
  birthDate?: Date;
}
