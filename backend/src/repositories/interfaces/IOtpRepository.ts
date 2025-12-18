import { IOTP } from "../../models/otp.model";

export interface IOtpRepository {
  saveOtp(data: Partial<IOTP>): Promise<IOTP>;
  findOtpByEmail(email: string): Promise<IOTP | null>;
  deleteOtpByEmail(email: string): Promise<void>;
  deleteOtpById(id: string): Promise<void>;
}
