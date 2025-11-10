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
const validateDto_middleware_1 = require("../../middlewares/validateDto.middleware");
const UserAuth_dto_1 = require("../../dtos/user/UserAuth.dto");
let OtpService = class OtpService {
    constructor(_otpRepository, _userRepository) {
        this._otpRepository = _otpRepository;
        this._userRepository = _userRepository;
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async requestOtp(email) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.ResendOtpDto, { email });
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const cleanEmail = email.toLowerCase().trim();
        await this._otpRepository.deleteOtpByEmail(cleanEmail);
        await this._otpRepository.saveOtp({ email: cleanEmail, otp, expiresAt });
        const response = await (0, sendOtp_1.sendOtpEmail)(cleanEmail, otp);
        logger_1.default.info(`OTP generated and sent to ${cleanEmail}`);
        return "OTP sent successfully";
    }
    async verifyOtp(email, otp) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.VerifyOtpDto, { email, otp });
        const record = await this._otpRepository.findOtpByEmail(email);
        if (!record) {
            throw new customError_1.CustomError("No verification code found for this email", statusCode_enum_1.StatusCode.NOT_FOUND);
        }
        if (record.expiresAt < new Date()) {
            await this._otpRepository.deleteOtpById(record._id.toString());
            throw new customError_1.CustomError("OTP has expired", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        if (record.otp !== otp) {
            throw new customError_1.CustomError("Invalid OTP", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        logger_1.default.info(`OTP verified successfully for ${email}`);
        await this._otpRepository.deleteOtpById(record._id.toString());
        return true;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IOtpRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], OtpService);
