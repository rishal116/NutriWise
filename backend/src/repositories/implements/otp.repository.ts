import { injectable } from "inversify";
import { Types } from "mongoose";
import { OtpModel, IOTP } from "../../models/otp.model";
import { IOtpRepository } from "../interfaces/IOtpRepository";

@injectable()
export class OtpRepository implements IOtpRepository {
  async saveOtp(data: Partial<IOTP>): Promise<IOTP> {
    return await OtpModel.create(data);
  }

  async findOtpByEmail(email: string): Promise<IOTP | null> {
    return await OtpModel.findOne({ email }).sort({ createdAt: -1 }).exec();
  }

  async deleteOtpByEmail(email: string): Promise<void> {
    await OtpModel.deleteMany({ email });
  }

  async deleteOtpById(id: string): Promise<void> {
    await OtpModel.findByIdAndDelete(id);
  }
}
