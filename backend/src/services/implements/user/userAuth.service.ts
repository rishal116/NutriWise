import { injectable, inject } from "inversify";
import bcrypt from "bcryptjs";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../interfaces/user/IUserAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IOTPService } from "../../interfaces/IOtpService";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { UserRegisterDto, VerifyOtpDto, UserRoleDto } from "../../../dtos/user/UserAuth.dtos";
import { saveTempUser, findTempUserByEmail, deleteTempUser } from "../../../utils/tempUser";
import { generateTokens } from "../../../utils/jwt";

@injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.IOTPService)
    private _otpService: IOTPService 
  ) {}
  

  async signup(data: UserRegisterDto): Promise<{ message: string }> {
    const { fullName, email, phone, password } = data;
    logger.info(`Signup request initiated for ${email}`);
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }
    const tempUserData = { fullName, email, phone, password };
    await saveTempUser(email, tempUserData);
    await this._otpService.requestOtp(email);
    logger.info(`OTP sent successfully to ${email}`);
    return { message: "OTP sent to your email. Please verify to complete signup." };
  }
  

  async verifyOtp(data: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otp } = data;
    logger.info(`Verifying OTP for ${email}`);
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) {
      throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);
    }
    const tempUser = await findTempUserByEmail(email);
    if (!tempUser) {
      throw new CustomError("Temporary user data not found", StatusCode.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    await this._userRepository.createUser({
      fullName: tempUser.fullName,
      email: tempUser.email,
      phone: tempUser.phone,
      password: hashedPassword,
      isVerified: true,
    });
    await deleteTempUser(email);
    logger.info(`User verified and registered successfully: ${email}`);
    return {
      message: "Signup successful! Please select your role to complete your profile.",
    };
  }
  
  async selectUserRole(data: UserRoleDto): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const { email, role } = data;
    logger.info(`Role selection request for email: ${email} -> ${role}`);
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    user.role = role;
    await this._userRepository.updateUser(user._id, { role });
    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    logger.info(`Role '${role}' assigned successfully for user: ${user.email}`);
    return {
      message: `Role '${role}' assigned successfully.`, accessToken, refreshToken,};
    }

}
