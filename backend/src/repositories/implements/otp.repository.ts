import { injectable } from "inversify";
import { Types } from "mongoose";
import { OtpModel, IOTP } from "../../models/otp.model";
import logger from "../../utils/logger";
import { IOtpRepository } from "../interfaces/IOtpRepository";

@injectable()
export class OtpRepository implements IOtpRepository {

  async saveOtp(email: string, otp: string, expiresAt: Date): Promise<IOTP> {
    try {
      const cleanEmail = email.toLowerCase().trim();

      await OtpModel.deleteMany({ email: cleanEmail });

      const otpRecord = await OtpModel.create({
        email: cleanEmail,
        otp,
        expiresAt, 
      });

      logger.info(`OTP saved for email: ${cleanEmail}`);
      return otpRecord;
    } catch (error: any) {
      logger.error("Error saving OTP:", error);
      throw new Error("Failed to save OTP");
    }
  }


  async findOtpByEmail(email: string): Promise<IOTP | null> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const record = await OtpModel.findOne({ email: cleanEmail })
        .sort({ createdAt: -1 })
        .exec();

      logger.info(
        `OTP lookup for ${cleanEmail}: ${record ? "found" : "not found"}`
      );
      return record;
    } catch (error: any) {
      logger.error("Error finding OTP:", error);
      throw new Error("Failed to find OTP");
    }
  }


  async deleteOtp(identifier: string): Promise<IOTP | null> {
    try {
      let result: IOTP | null = null;

      if (Types.ObjectId.isValid(identifier)) {
        result = await OtpModel.findByIdAndDelete(identifier).exec();
      } else {
        result = await OtpModel.findOneAndDelete({
          email: identifier.toLowerCase().trim(),
        }).exec();
      }

      logger.info(`OTP deleted for: ${identifier}`);
      return result;
    } catch (error: any) {
      logger.error("Error deleting OTP:", error);
      throw new Error("Failed to delete OTP");
    }
  }

  
}
