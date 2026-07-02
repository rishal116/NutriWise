import { injectable, inject } from "inversify";
import { IOTPService } from "../../interfaces/common/IOtpService";
import { IOtpRepository } from "../../../repositories/interfaces/common/IOtpRepository";
import { TYPES } from "../../../types/types";
import { sendOtpEmail } from "../../../utils/sendOtp";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class OtpService implements IOTPService {
  constructor(
    @inject(TYPES.IOtpRepository)
    private _otpRepository: IOtpRepository,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this._otpRepository.deleteOtpByEmail(cleanEmail);
    await this._otpRepository.saveOtp({
      email: cleanEmail,
      otp,
      expiresAt,
    });
    await sendOtpEmail(cleanEmail, otp);
    logger.info("OTP sent successfully", { email: cleanEmail });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const record = await this._otpRepository.findOtpByEmail(cleanEmail);
    if (!record) {
      throw new CustomError(
        "No OTP found for this email",
        StatusCode.NOT_FOUND,
      );
    }
    if (record.expiresAt < new Date()) {
      await this._otpRepository.deleteOtpById(record._id.toString());
      throw new CustomError("OTP has expired", StatusCode.BAD_REQUEST);
    }
    if (record.otp !== otp) {
      throw new CustomError("Invalid OTP", StatusCode.BAD_REQUEST);
    }
    await this._otpRepository.deleteOtpById(record._id.toString());
    logger.info("OTP verified successfully", {
      email: cleanEmail,
    });
    return true;
  }
}
