

export interface ISignupDTO {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ISigninDTO {
  email: string;
  password: string;
}

export interface IVerifyOtpDTO {
  email: string;
  otp: string;
}

export interface IForgotPasswordDTO {
  email: string;
}

export interface IResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IUserAuthService {
  signup(data: ISignupDTO): Promise<{ message: string }>;
  signin(data: ISigninDTO): Promise<{  accessToken: string; refreshToken: string;message: string }>;
  verifyOtp(data: IVerifyOtpDTO): Promise<{ message: string }>;
  forgotPassword(data: IForgotPasswordDTO): Promise<{ message: string }>;
  resetPassword(data: IResetPasswordDTO): Promise<{ message: string }>;
}
