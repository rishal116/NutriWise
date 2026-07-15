import { GetUserProfileDto } from "../../../dtos/user/profile/getUserProfile.dto";
import { UpdateUserProfileDto } from "../../../dtos/user/profile/updateUserProfile.dto";
import { UserProfileImageDto } from "../../../dtos/user/profile/userProfileImage.dto";

export interface IUserProfileService {
  getProfile(userId: string): Promise<GetUserProfileDto>;

  updateProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<GetUserProfileDto>;

  updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UserProfileImageDto>;
}
