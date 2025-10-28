import bcrypt from "bcryptjs";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuthService";
import { IAdminRepository } from "../../../repositories/interfaces/admin/IAdminRepository";
import { generateTokens, verifyRefreshToken } from "../../../utils/jwt";
import { OtpModel } from "../../../models/otp.model";
import { sendOtpEmail } from "../../../utils/sendOtp";

import {
  AdminLoginDto,
  AdminChangePasswordDto,
  AdminForgotPasswordDto,
  AdminResetPasswordDto,
  AdminLoginResponseDto,
  AdminResponseDto,
} from "../../../dtos/admin/adminAuth.dtos"; 

export class AdminAuthService implements IAdminAuthService {
  constructor(private adminRepo: IAdminRepository) {}

  async login(dto: AdminLoginDto) {
    const { email, password } = dto;

    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error("Invalid credentials");

    const { accessToken, refreshToken } = generateTokens(admin._id.toString(), "admin");
    await this.adminRepo.saveRefreshToken(admin._id.toString(), refreshToken);

    return new AdminLoginResponseDto(admin, accessToken, refreshToken);
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    return new AdminResponseDto(admin);
  }

  async changePassword(adminId: string, dto: AdminChangePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new Error("Admin not found");

    const valid = await bcrypt.compare(oldPassword!, admin.password);
    if (!valid) throw new Error("Old password is incorrect");

    const hashed = await bcrypt.hash(newPassword!, 10);
    await this.adminRepo.updatePassword(adminId, hashed);

    return { message: "Password updated successfully" };
  }

  async logout(adminId: string) {
    await this.adminRepo.saveRefreshToken(adminId, "");
    return { message: "Logged out successfully" };
  }

  async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    const admin = await this.adminRepo.findByRefreshToken(token);
    if (!admin) throw new Error("Invalid refresh token");

    const { accessToken } = generateTokens(admin._id.toString(), "admin");
    return { accessToken };
  }

  async forgotPassword(dto: AdminForgotPasswordDto) {
    const { email } = dto;
    const admin = await this.adminRepo.findByEmail(email!);
    if (!admin) throw new Error("Email not found");

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email!, otpCode);
    return { message: "OTP sent to email" };
  }

  async verifyOtp(email: string, otp: string) {
    const otpRecord = await OtpModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) throw new Error("Invalid or expired OTP");

    return { message: "OTP verified successfully" };
  }

  async resetPassword(dto: AdminResetPasswordDto) {
    const { email, otp, newPassword } = dto;

    const otpRecord = await OtpModel.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) throw new Error("Invalid or expired OTP");

    const admin = await this.adminRepo.findByEmail(email!);
    if (!admin) throw new Error("Admin not found");

    const hashed = await bcrypt.hash(newPassword!, 10);
    await this.adminRepo.updatePassword(admin._id.toString(), hashed);
    await OtpModel.deleteOne({ email });

    return { message: "Password reset successfully" };
  }
}
