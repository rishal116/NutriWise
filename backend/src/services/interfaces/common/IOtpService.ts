export interface IOTPService {
  requestOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
}
