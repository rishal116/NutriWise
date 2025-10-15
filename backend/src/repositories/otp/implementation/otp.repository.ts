import { OtpModel } from "../../../models/otp.model";
import { IOtpRepository } from "../interface/IOtpRepository";

export class OtpRepository implements IOtpRepository {
  async upsertOtp(email: string, otp: string, expiresAt: Date) {
    await OtpModel.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true }
    );
  }

  async findByEmail(email: string) {
    return await OtpModel.findOne({ email });
  }

  async deleteByEmail(email: string) {
    await OtpModel.deleteOne({ email });
  }
}
