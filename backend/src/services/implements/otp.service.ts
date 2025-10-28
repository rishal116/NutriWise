import { injectable, inject } from "inversify";
import { IOTPService } from "../interfaces/IOtpService";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { TYPES } from "../../types/types";
import { sendOtpEmail } from "../../utils/sendOtp";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IUserRepository } from "../../repositories/interfaces/user/IUserRepository";

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
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    
    logger.info(`Generated OTP ${otp} for email ${email}, expires in 1 minute`);
    
    await this._otpRepository.deleteOtp(email);
    await this._otpRepository.saveOtp(email, otp, expiresAt);
    
    await sendOtpEmail(email, otp);
    logger.info(`OTP successfully sent to ${email}`);
    return otp;
  }
  

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const record = await this._otpRepository.findOtpByEmail(email);
      
      if (!record) {
        throw new CustomError("No verification code found for this email",StatusCode.NOT_FOUND);
      }
      
      if (record.expiresAt < new Date()) {
        await this._otpRepository.deleteOtp(record._id.toString());
        throw new CustomError("OTP has expired", StatusCode.BAD_REQUEST);
      }

      if (record.otp !== otp) {
        throw new CustomError("Invalid OTP", StatusCode.BAD_REQUEST);
      }

      await this._otpRepository.deleteOtp(record._id.toString());

      logger.info(`OTP verified successfully for ${email}`);
      return true;
    } catch (error) {
      logger.error("Error verifying OTP:", error);
      throw error instanceof CustomError
        ? error
        : new CustomError("OTP verification failed", StatusCode.BAD_REQUEST);
    }
  }

    async requestForgotPasswordOtp(email: string): Promise<string> {
    try {
      
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        throw new CustomError("No account found with this email address",StatusCode.NOT_FOUND);
      }
      
      const otp = this.generateOtp();
      const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
      
      logger.info(`Generated forgot password OTP ${otp} for ${email}, expires in 1 minute`);
      
      await this._otpRepository.deleteOtp(email);
      await this._otpRepository.saveOtp(email, otp, expiresAt);
      await sendOtpEmail(email, otp);
      
      logger.info(`Forgot password OTP sent to ${email}`);
      return otp;
    
    } catch (error) {
      logger.error("Error requesting forgot password OTP:", error);
      throw error instanceof CustomError ? error : new CustomError("Failed to send password reset code",StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async clearOtp(email: string): Promise<void> {
    try {
      await this._otpRepository.deleteOtp(email);
      logger.info(`OTP cleared for ${email}`);
    } catch (error) {
      logger.error("Error clearing OTP:", error);
      throw new CustomError(
        "Failed to clear OTP",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}