import { UserProfile,UpdateUserProfileDto,UserProfileImage } from "../../../dtos/user/userProfile.dto";

export interface IUserProfileService {
  getMyProfile(userId: string): Promise<UserProfile>;
  updateMyProfile(userId: string,data: UpdateUserProfileDto): Promise<UserProfile>;
  getMyProfileImage(userId: string): Promise<UserProfileImage | null>;
  updateMyProfileImage(userId: string,file: Express.Multer.File): Promise<UserProfileImage>;
}