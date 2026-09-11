import { IUser } from "../../../models/user.model";
import { GetUserProfileDto } from "../../../dtos/user/profile/getUserProfile.dto";
import { UserProfileImageDto } from "../../../dtos/user/profile/userProfileImage.dto";

export const toUserProfileDto = (user: IUser): GetUserProfileDto => ({
  profileImage: user.profileImage,

  fullName: user.fullName,
  email: user.email,

  phone: user.phone,
  gender: user.gender,
  birthDate: user.birthDate,
});

export const toUserProfileImageDto = (
  profileImage: string,
): UserProfileImageDto => ({
  profileImage,
});
