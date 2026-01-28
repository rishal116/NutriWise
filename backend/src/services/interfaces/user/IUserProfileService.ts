export interface IUserProfileService {
  getUserProfile(userId: string): Promise<any>;
  updateUserProfile(userId: string, data: any): Promise<any>;
  getNutritionistProfileImage(userId: string): Promise<{ profileImage: string } | null>;
  updateNutritionistProfileImage(userId: string,file: Express.Multer.File): Promise<any>;
}
