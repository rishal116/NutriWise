
export interface IOTPService {

  requestOtp(email: string): Promise<string>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  requestForgotPasswordOtp(email: string,role: 'user' | 'admin' | 'nutritionist'): Promise<string>;
  clearOtp(email: string): Promise<void>;
}
