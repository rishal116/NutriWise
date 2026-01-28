import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserAccountService } from "../../../services/interfaces/user/IUserAccountService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import logger from "../../../utils/logger";

@injectable()
export class UserAccountService implements IUserAccountService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository
  ) {}
  
  async changePassword(userId: string,currentPassword: string,newPassword: string): Promise<void> {
    logger.info(`[CHANGE_PASSWORD] Attempt started | userId=${userId}`);
    const user = await this._userRepository.findById(userId);
    if (!user) {
      logger.warn(`[CHANGE_PASSWORD] User not found | userId=${userId}`);
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    if (!user.password) {
        logger.warn(`[CHANGE_PASSWORD] Social login account | userId=${userId}`);
        throw new CustomError("Password change not allowed for social login accounts",
            StatusCode.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(currentPassword,user.password);
    if (!isPasswordValid) {
        logger.warn(`[CHANGE_PASSWORD] Invalid current password | userId=${userId}`);
        throw new CustomError("Current password is incorrect",StatusCode.UNAUTHORIZED);
    }
    if (currentPassword === newPassword) {
        logger.warn(`[CHANGE_PASSWORD] New password same as old | userId=${userId}`);
        throw new CustomError("New password cannot be same as current password",
            StatusCode.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePasswordById(userId, hashedPassword);
    logger.info(`[CHANGE_PASSWORD] Password updated successfully | userId=${userId}`)
    }

}
