import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProfileService } from "../../interfaces/user/IUserProfileService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository
  ) {}
  
  
  async getUserProfile(userId: string) {
    logger.info(`Fetching profile for user: ${userId}`);
    const user = await this._userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      gender: user.gender,
      age: user.age,
      profileImage: user.profileImage,
    };
  }

  async updateUserProfile(userId: string, data: any) {
    logger.info(`Updating profile for user: ${userId}`);

    const user = await this._userRepository.findById(userId);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);

    const updatedProfile = {
      fullName: data.fullName ?? user.fullName,
      phone: data.phone ?? user.phone,
      birthdate: data.birthdate ?? user.birthdate,
      gender: data.gender ?? user.gender,
      age: data.age ?? user.age,
      profileImage: data.profileImage ?? user.profileImage,
    };

    const updatedUser = await this._userRepository.updateUser(userId, updatedProfile);

    return {
      fullName: updatedUser!.fullName,
      email: updatedUser!.email,
      phone: updatedUser!.phone,
      birthdate: updatedUser!.birthdate,
      gender: updatedUser!.gender,
      age: updatedUser!.age,
      profileImage: updatedUser!.profileImage,
    };
  }
}
