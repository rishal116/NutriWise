"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../../../models/user.model");
const otp_model_1 = require("../../../models/otp.model");
const sendOtp_1 = require("../../../utils/sendOtp");
const jwt_1 = require("../../../utils/jwt");
class UserAuthService {
    async signup(data) {
        const { fullName, email, phone, password } = data;
        const existingUser = await user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.UserModel({
            fullName,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
        });
        await newUser.save();
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, { email, otp: otpCode, expiresAt }, { upsert: true, new: true });
        await (0, sendOtp_1.sendOtpEmail)(email, otpCode);
        return { message: "Signup successful. OTP sent to email." };
    }
    async signin(data) {
        const { email, password } = data;
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        if (!user.isVerified) {
            throw new Error("Please verify your email using OTP");
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), "user");
        return {
            accessToken,
            refreshToken,
            message: "Signin successful",
        };
    }
    async verifyOtp(data) {
        const { email, otp } = data;
        const otpRecord = await otp_model_1.OtpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }
        // Mark user as verified
        await user_model_1.UserModel.updateOne({ email }, { $set: { isVerified: true } });
        // Remove used OTP
        await otp_model_1.OtpModel.deleteOne({ email });
        return { message: "OTP verified successfully" };
    }
    async forgotPassword(data) {
        const { email } = data;
        const user = await user_model_1.UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, { email, otp: otpCode, expiresAt }, { upsert: true, new: true });
        await (0, sendOtp_1.sendOtpEmail)(email, otpCode);
        return { message: "OTP sent for password reset" };
    }
    async resetPassword(data) {
        const { email, otp, newPassword } = data;
        const otpRecord = await otp_model_1.OtpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        await user_model_1.UserModel.updateOne({ email }, { $set: { password: hashed } });
        await otp_model_1.OtpModel.deleteOne({ email });
        return { message: "Password reset successful" };
    }
}
exports.UserAuthService = UserAuthService;
