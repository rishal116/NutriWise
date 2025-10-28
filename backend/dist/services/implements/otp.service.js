"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types/types");
const sendOtp_1 = require("../../utils/sendOtp");
const logger_1 = __importDefault(require("../../utils/logger"));
const customError_1 = require("../../utils/customError");
const statusCode_enum_1 = require("../../enums/statusCode.enum");
let OtpService = class OtpService {
    constructor(_otpRepository, _userRepository) {
        this._otpRepository = _otpRepository;
        this._userRepository = _userRepository;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async requestOtp(email) {
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        logger_1.default.info(`Generated OTP ${otp} for email ${email}, expires in 1 minute`);
        await this._otpRepository.deleteOtp(email);
        await this._otpRepository.saveOtp(email, otp, expiresAt);
        await (0, sendOtp_1.sendOtpEmail)(email, otp);
        logger_1.default.info(`OTP successfully sent to ${email}`);
        return otp;
    }
    async verifyOtp(email, otp) {
        try {
            const record = await this._otpRepository.findOtpByEmail(email);
            if (!record) {
                throw new customError_1.CustomError("No verification code found for this email", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            if (record.expiresAt < new Date()) {
                await this._otpRepository.deleteOtp(record._id.toString());
                throw new customError_1.CustomError("OTP has expired", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            if (record.otp !== otp) {
                throw new customError_1.CustomError("Invalid OTP", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            await this._otpRepository.deleteOtp(record._id.toString());
            logger_1.default.info(`OTP verified successfully for ${email}`);
            return true;
        }
        catch (error) {
            logger_1.default.error("Error verifying OTP:", error);
            throw error instanceof customError_1.CustomError
                ? error
                : new customError_1.CustomError("OTP verification failed", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
    }
    async requestForgotPasswordOtp(email) {
        try {
            const existingUser = await this._userRepository.findByEmail(email);
            if (!existingUser) {
                throw new customError_1.CustomError("No account found with this email address", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const otp = this.generateOtp();
            const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
            logger_1.default.info(`Generated forgot password OTP ${otp} for ${email}, expires in 1 minute`);
            await this._otpRepository.deleteOtp(email);
            await this._otpRepository.saveOtp(email, otp, expiresAt);
            await (0, sendOtp_1.sendOtpEmail)(email, otp);
            logger_1.default.info(`Forgot password OTP sent to ${email}`);
            return otp;
        }
        catch (error) {
            logger_1.default.error("Error requesting forgot password OTP:", error);
            throw error instanceof customError_1.CustomError ? error : new customError_1.CustomError("Failed to send password reset code", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
    async clearOtp(email) {
        try {
            await this._otpRepository.deleteOtp(email);
            logger_1.default.info(`OTP cleared for ${email}`);
        }
        catch (error) {
            logger_1.default.error("Error clearing OTP:", error);
            throw new customError_1.CustomError("Failed to clear OTP", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IOtpRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], OtpService);
