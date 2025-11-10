import { injectable, inject } from "inversify";
import { IOTPService } from "../interfaces/IOtpService";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { TYPES } from "../../types/types";
import { sendOtpEmail } from "../../utils/sendOtp";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IUserRepository } from "../../repositories/interfaces/user/IUserRepository";
import { validateDto } from "../../middlewares/validateDto.middleware";
import { ResendOtpDto, VerifyOtpDto } from "../../dtos/user/UserAuth.dto";

@injectable()
export class OtpService implements IOTPService {
  constructor(
    @inject(TYPES.IOtpRepository) private _otpRepository: IOtpRepository,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}
  
  
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  

  async requestOtp(email: string): Promise<string> {
    await validateDto(ResendOtpDto, { email });
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    const cleanEmail = email.toLowerCase().trim();
    await this._otpRepository.deleteOtpByEmail(cleanEmail);
    await this._otpRepository.saveOtp({ email: cleanEmail, otp, expiresAt });
    const response = await sendOtpEmail(cleanEmail, otp);
    logger.info(`OTP generated and sent to ${cleanEmail}`);
    return "OTP sent successfully";
  }
  

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    await validateDto(VerifyOtpDto, { email, otp });
    const record = await this._otpRepository.findOtpByEmail(email);
    if (!record) {
      throw new CustomError("No verification code found for this email",StatusCode.NOT_FOUND);
    }
    if (record.expiresAt < new Date()) {
      await this._otpRepository.deleteOtpById(record._id.toString());
      throw new CustomError("OTP has expired", StatusCode.BAD_REQUEST);
    }
    if (record.otp !== otp) {
      throw new CustomError("Invalid OTP", StatusCode.BAD_REQUEST);
    }
    logger.info(`OTP verified successfully for ${email}`);
    await this._otpRepository.deleteOtpById(record._id.toString());
    return true;
  }
  

}