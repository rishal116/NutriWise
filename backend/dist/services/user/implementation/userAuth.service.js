"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otp_model_1 = require("../../../models/otp.model");
const sendOtp_1 = require("../../../utils/sendOtp");
class UserAuthService {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    async signup(data) {
        const { fullName, email, phone, password } = data;
        const existingUser = await this._userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, {
            email,
            otp: otpCode,
            expiresAt,
            tempUser: { fullName, email, phone, password }
        }, { upsert: true, new: true });
        await (0, sendOtp_1.sendOtpEmail)(email, otpCode);
        return { message: "OTP sent to email. Please verify to complete signup.",
        };
    }
    async verifyOtp(data) {
        const { email, otp } = data;
        const otpRecord = await otp_model_1.OtpModel.findOne({ email: data.email });
        if (!otpRecord)
            throw new Error("OTP not found. Please request a new one.");
        const now = new Date();
        if (otpRecord.otp.toString() !== otp.trim() || otpRecord.expiresAt < now) {
            throw new Error("Invalid or expired OTP");
        }
        const tempUser = otpRecord.tempUser;
        if (!tempUser)
            throw new Error("Temporary user data missing");
        const hashedPassword = await bcryptjs_1.default.hash(tempUser.password, 10);
        await this._userRepository.createUser({
            fullName: tempUser.fullName,
            email: tempUser.email,
            phone: tempUser.phone,
            password: hashedPassword,
            isVerified: true,
        });
        await otp_model_1.OtpModel.deleteOne({ email });
        return { message: "Signup successful. Your account is now active." };
    }
}
exports.UserAuthService = UserAuthService;
