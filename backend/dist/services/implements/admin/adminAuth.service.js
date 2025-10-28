"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../../utils/jwt");
const otp_model_1 = require("../../../models/otp.model");
const sendOtp_1 = require("../../../utils/sendOtp");
const adminAuth_dtos_1 = require("../../../dtos/admin/adminAuth.dtos");
class AdminAuthService {
    constructor(adminRepo) {
        this.adminRepo = adminRepo;
    }
    async login(dto) {
        const { email, password } = dto;
        const admin = await this.adminRepo.findByEmail(email);
        if (!admin)
            throw new Error("Invalid credentials");
        const valid = await bcryptjs_1.default.compare(password, admin.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(admin._id.toString(), "admin");
        await this.adminRepo.saveRefreshToken(admin._id.toString(), refreshToken);
        return new adminAuth_dtos_1.AdminLoginResponseDto(admin, accessToken, refreshToken);
    }
    async getProfile(adminId) {
        const admin = await this.adminRepo.findById(adminId);
        if (!admin)
            throw new Error("Admin not found");
        return new adminAuth_dtos_1.AdminResponseDto(admin);
    }
    async changePassword(adminId, dto) {
        const { oldPassword, newPassword } = dto;
        const admin = await this.adminRepo.findById(adminId);
        if (!admin)
            throw new Error("Admin not found");
        const valid = await bcryptjs_1.default.compare(oldPassword, admin.password);
        if (!valid)
            throw new Error("Old password is incorrect");
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        await this.adminRepo.updatePassword(adminId, hashed);
        return { message: "Password updated successfully" };
    }
    async logout(adminId) {
        await this.adminRepo.saveRefreshToken(adminId, "");
        return { message: "Logged out successfully" };
    }
    async refreshToken(token) {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const admin = await this.adminRepo.findByRefreshToken(token);
        if (!admin)
            throw new Error("Invalid refresh token");
        const { accessToken } = (0, jwt_1.generateTokens)(admin._id.toString(), "admin");
        return { accessToken };
    }
    async forgotPassword(dto) {
        const { email } = dto;
        const admin = await this.adminRepo.findByEmail(email);
        if (!admin)
            throw new Error("Email not found");
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, { email, otp: otpCode, expiresAt }, { upsert: true, new: true });
        await (0, sendOtp_1.sendOtpEmail)(email, otpCode);
        return { message: "OTP sent to email" };
    }
    async verifyOtp(email, otp) {
        const otpRecord = await otp_model_1.OtpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp)
            throw new Error("Invalid or expired OTP");
        return { message: "OTP verified successfully" };
    }
    async resetPassword(dto) {
        const { email, otp, newPassword } = dto;
        const otpRecord = await otp_model_1.OtpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp)
            throw new Error("Invalid or expired OTP");
        const admin = await this.adminRepo.findByEmail(email);
        if (!admin)
            throw new Error("Admin not found");
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        await this.adminRepo.updatePassword(admin._id.toString(), hashed);
        await otp_model_1.OtpModel.deleteOne({ email });
        return { message: "Password reset successfully" };
    }
}
exports.AdminAuthService = AdminAuthService;
