import {
  UserProfile,
  UpdateUserProfileDto,
  UserProfileImage,
} from "../../../dtos/user/userProfile.dto";

export interface IUserProfileService {
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<UserProfile>;

  getProfileImage(userId: string): Promise<UserProfileImage | null>;
  updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileImage>;
}
