import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserAuthService, ISignupDTO, ISigninDTO, IVerifyOtpDTO, IForgotPasswordDTO, IResetPasswordDTO } from "../interface/IUserAuthService";
import { UserModel } from "../../../models/user.model";
import { OtpModel } from "../../../models/otp.model";
import { sendOtpEmail } from "../../../utils/sendOtp";
import { generateTokens } from "../../../utils/jwt";

export class UserAuthService implements IUserAuthService {

  async signup(data: ISignupDTO): Promise<{message: string }> {
    const { fullName, email, phone, password } = data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otpCode);

    return { message: "Signup successful. OTP sent to email." };
  }

  async signin(data: ISigninDTO): Promise<{accessToken: string; refreshToken: string; message: string }> {
    const { email, password } = data;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email using OTP");
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), "user");
    return {
        accessToken,
        refreshToken,
        message: "Signin successful",
    };
  }

  async verifyOtp(data: IVerifyOtpDTO): Promise<{ message: string }> {
    const { email, otp } = data;

    const otpRecord = await OtpModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      throw new Error("Invalid or expired OTP");
    }

    // Mark user as verified
    await UserModel.updateOne({ email }, { $set: { isVerified: true } });

    // Remove used OTP
    await OtpModel.deleteOne({ email });

    return { message: "OTP verified successfully" };
  }

  async forgotPassword(data: IForgotPasswordDTO): Promise<{ message: string }> {
    const { email } = data;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otpCode);

    return { message: "OTP sent for password reset" };
  }

  async resetPassword(data: IResetPasswordDTO): Promise<{ message: string }> {
    const { email, otp, newPassword } = data;

    const otpRecord = await OtpModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      throw new Error("Invalid or expired OTP");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne({ email }, { $set: { password: hashed } });

    await OtpModel.deleteOne({ email });

    return { message: "Password reset successful" };
  }
}
