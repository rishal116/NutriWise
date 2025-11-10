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
exports.AdminAuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../../utils/jwt");
const otp_model_1 = require("../../../models/otp.model");
const sendOtp_1 = require("../../../utils/sendOtp");
const customError_1 = require("../../../utils/customError");
const statusCode_enum_1 = require("../../../enums/statusCode.enum");
const adminAuth_dto_1 = require("../../../dtos/admin/adminAuth.dto");
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
const validateDto_middleware_1 = require("../../../middlewares/validateDto.middleware");
let AdminAuthService = class AdminAuthService {
    constructor(_adminRepository) {
        this._adminRepository = _adminRepository;
    }
    async login(dto) {
        await (0, validateDto_middleware_1.validateDto)(adminAuth_dto_1.AdminLoginDto, dto);
        const { email, password } = dto;
        const admin = await this._adminRepository.findByEmail(email);
        if (!admin)
            throw new customError_1.CustomError("Invalid credentials", 401);
        const valid = await bcryptjs_1.default.compare(password, admin.password);
        if (!valid)
            throw new customError_1.CustomError("Invalid credentials", 401);
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(admin._id.toString(), "admin");
        return new adminAuth_dto_1.AdminLoginResponseDto(admin, accessToken, refreshToken);
    }
    async forgotPassword(dto) {
        const { email } = dto;
        const admin = await this._adminRepository.findByEmail(email);
        if (!admin) {
            throw new customError_1.CustomError("Email not found", statusCode_enum_1.StatusCode.NOT_FOUND);
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, { email, otp: otpCode, expiresAt }, { upsert: true, new: true });
        await (0, sendOtp_1.sendOtpEmail)(email, otpCode);
        return { message: "OTP sent to email" };
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminRepository)),
    __metadata("design:paramtypes", [Object])
], AdminAuthService);
