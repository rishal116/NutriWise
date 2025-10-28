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
exports.UserAuthController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
const statusCode_enum_1 = require("../../../enums/statusCode.enum");
const logger_1 = __importDefault(require("../../../utils/logger"));
const asyncHandler_1 = require("../../../utils/asyncHandler");
const UserAuth_dtos_1 = require("../../../dtos/user/UserAuth.dtos");
const google_auth_library_1 = require("google-auth-library");
let UserAuthController = class UserAuthController {
    constructor(_userAuthService, _otpService) {
        this._userAuthService = _userAuthService;
        this._otpService = _otpService;
        this.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const registerDto = req.body;
            const { email } = registerDto;
            logger_1.default.info(`Registration attempt - Email: ${email}`);
            await this._userAuthService.signup(registerDto);
            const response = new UserAuth_dtos_1.RegisterResponseDto(true, "OTP sent to your email for verification");
            res.status(statusCode_enum_1.StatusCode.OK).json(response);
        });
        this.verifyOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const verifyOtpDto = req.body;
            const { email, otp } = verifyOtpDto;
            logger_1.default.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
            await this._userAuthService.verifyOtp(verifyOtpDto);
            const response = new UserAuth_dtos_1.LoginResponseDto(true, "Account created successfully");
            res.status(statusCode_enum_1.StatusCode.CREATED).json(response);
        });
        this.resendOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const registerDto = req.body;
            const { email } = registerDto;
            logger_1.default.info(`Registration attempt - Email: ${email}`);
            await this._otpService.requestOtp(email);
            const response = new UserAuth_dtos_1.RegisterResponseDto(true, "OTP sent to your email for verification");
            res.status(statusCode_enum_1.StatusCode.OK).json(response);
        });
        this.selectRole = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { email, role } = req.body;
            const result = await this._userAuthService.selectUserRole({ email, role });
            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            })
                .cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
                .status(statusCode_enum_1.StatusCode.OK)
                .json({
                success: true,
                message: "Role selected successfully",
            });
        });
        this._googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
};
exports.UserAuthController = UserAuthController;
exports.UserAuthController = UserAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserAuthService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __metadata("design:paramtypes", [Object, Object])
], UserAuthController);
