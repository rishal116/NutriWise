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
exports.NutritionistAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const types_1 = require("../../../types/types");
const customError_1 = require("../../../utils/customError");
const statusCode_enum_1 = require("../../../enums/statusCode.enum");
const logger_1 = __importDefault(require("../../../utils/logger"));
const validateDto_middleware_1 = require("../../../middlewares/validateDto.middleware");
const UserAuth_dto_1 = require("../../../dtos/user/UserAuth.dto");
const jwt_1 = require("../../../utils/jwt");
const mongoose_1 = require("mongoose");
let NutritionistAuthService = class NutritionistAuthService {
    constructor(_nutritionistRepository, _otpService, _adminRepository, _adminNotificationService, _nutritionistDetailsRepository) {
        this._nutritionistRepository = _nutritionistRepository;
        this._otpService = _otpService;
        this._adminRepository = _adminRepository;
        this._adminNotificationService = _adminNotificationService;
        this._nutritionistDetailsRepository = _nutritionistDetailsRepository;
    }
    async signup(req, data) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.UserRegisterDto, data);
        const { fullName, email, phone, password } = data;
        logger_1.default.info(`Signup request initiated for ${email}`);
        const existingUser = await this._nutritionistRepository.findByEmail(email);
        if (existingUser) {
            throw new customError_1.CustomError("User already exists", 409);
        }
        req.session.tempUser = { fullName, email, phone, password };
        const response = await this._otpService.requestOtp(email);
        logger_1.default.info(`OTP sent successfully for ${email}`);
        return { message: "OTP sent successfully. Please verify your email." };
    }
    async verifyOtp(req, data) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.VerifyOtpDto, data);
        const { email, otp } = data;
        logger_1.default.info(`Verifying OTP for ${email}`);
        const isValid = await this._otpService.verifyOtp(email, otp);
        if (!isValid) {
            throw new customError_1.CustomError("Invalid or expired OTP", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        const tempUser = req.session.tempUser;
        if (!tempUser) {
            throw new customError_1.CustomError("Temporary user data not found", statusCode_enum_1.StatusCode.NOT_FOUND);
        }
        const hashedPassword = await bcryptjs_1.default.hash(tempUser.password, 10);
        const newUser = await this._nutritionistRepository.createUser({
            fullName: tempUser.fullName,
            email: tempUser.email,
            phone: tempUser.phone,
            password: hashedPassword,
            isVerified: true,
            role: "nutritionist",
        });
        logger_1.default.info(`Nutritionist verified and registered successfully: ${email}`);
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(newUser._id.toString(), newUser.role || "nutritionist");
        delete req.session.tempUser;
        return { message: "Signup successful", accessToken, refreshToken, };
    }
    async resendOtp(data) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.ResendOtpDto, data);
        const { email } = data;
        logger_1.default.info(`Resending OTP for ${email}`);
        const existingUser = await this._nutritionistRepository.findByEmail(email);
        if (existingUser && existingUser.isVerified) {
            throw new customError_1.CustomError("Account already verified", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        const response = await this._otpService.requestOtp(email);
        logger_1.default.info(`New OTP sent to ${email}`);
        return { message: response };
    }
    async submitDetails(req, userId) {
        const { bio, videoCallRate, consultationDuration } = req.body;
        const qualification = req.body["qualification[]"] || req.body.qualification;
        const specialization = req.body["specialization[]"] || req.body.specialization;
        const languagesField = req.body["languages[]"] || req.body.languages;
        const normalizedQualification = Array.isArray(qualification) ? qualification : [qualification];
        const normalizedSpecialization = Array.isArray(specialization) ? specialization : [specialization];
        const normalizedLanguages = Array.isArray(languagesField) ? languagesField : [languagesField];
        const experiences = Object.keys(req.body)
            .filter((key) => key.startsWith("experience"))
            .reduce((acc, key) => {
            const match = key.match(/experience\[(\d+)\]\[(role|organization|years)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                acc[index] = acc[index] || { role: "", organization: "", years: 0 };
                acc[index][field] = field === "years"
                    ? Math.max(0, Number(req.body[key]) || 0)
                    : req.body[key];
            }
            return acc;
        }, []);
        const rate = Number(videoCallRate);
        if (isNaN(rate) || rate <= 0)
            throw new Error("Video Call Rate must be greater than 0");
        experiences.forEach((exp, i) => {
            if (exp.years <= 0)
                throw new Error(`Experience years for entry ${i + 1} must be greater than 0`);
        });
        const cv = req.file ? req.file.path : undefined;
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const existingDetails = await this._nutritionistDetailsRepository.findByUserId(userId);
        let result;
        if (existingDetails) {
            result = await this._nutritionistDetailsRepository.updateDetails(userId, {
                qualifications: normalizedQualification,
                specializations: normalizedSpecialization,
                experiences,
                bio,
                languages: normalizedLanguages,
                videoCallRate: rate,
                consultationDuration,
                cv,
            });
        }
        else {
            result = await this._nutritionistDetailsRepository.createDetails({
                userId: userObjectId,
                qualifications: normalizedQualification,
                specializations: normalizedSpecialization,
                experiences,
                bio,
                languages: normalizedLanguages,
                videoCallRate: rate,
                consultationDuration,
                cv,
            });
        }
        const nutritionist = await this._nutritionistRepository.findById(userId);
        if (!nutritionist)
            throw new Error("Nutritionist not found");
        const notification = {
            title: "New Nutritionist Profile Submitted",
            message: `Nutritionist ${nutritionist.fullName} has submitted their profile. Please review and approve.`,
            type: "info",
            userId: nutritionist._id.toString(),
        };
        await this._adminNotificationService.createNotification(notification);
        return { message: "Details saved successfully", data: result };
    }
};
exports.NutritionistAuthService = NutritionistAuthService;
exports.NutritionistAuthService = NutritionistAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IAdminRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IAdminNotificationRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.INutritionistDetailsRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], NutritionistAuthService);
