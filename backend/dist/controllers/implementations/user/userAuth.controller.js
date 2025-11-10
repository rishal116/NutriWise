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
const jwt_1 = require("../../../utils/jwt");
let UserAuthController = class UserAuthController {
    constructor(_userAuthService) {
        this._userAuthService = _userAuthService;
        this.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { fullName, email, phone, password, confirmPassword } = req.body;
            logger_1.default.info(`User registration attempt - Email: ${email}`);
            const response = await this._userAuthService.signup(req, { fullName, email, phone, password, confirmPassword, });
            res.status(statusCode_enum_1.StatusCode.OK).json({ success: true, message: response.message });
        });
        this.verifyOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { email, otp } = req.body;
            logger_1.default.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
            const response = await this._userAuthService.verifyOtp(req, { email, otp });
            (0, jwt_1.setAuthCookies)(res, response.refreshToken);
            res.status(statusCode_enum_1.StatusCode.CREATED).json({ success: true, message: response.message, accessToken: response.accessToken, });
        });
        this.resendOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { email } = req.body;
            logger_1.default.info(`Registration attempt - Email: ${email}`);
            const response = await this._userAuthService.resendOtp({ email });
            res.status(statusCode_enum_1.StatusCode.OK).json({ success: true, message: response.message });
        });
        this.login = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { email, password } = req.body;
            logger_1.default.info(`Login attempt - Email: ${email}`);
            const response = await this._userAuthService.login({ email, password });
            (0, jwt_1.setAuthCookies)(res, response.refreshToken);
            res.status(statusCode_enum_1.StatusCode.CREATED).json({ success: true, user: response.user, accessToken: response.accessToken, });
        });
        this.googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { credential, role } = req.body;
            logger_1.default.info(`Google login attempt - Role: ${role}`);
            const response = await this._userAuthService.googleLogin({ credential, role });
            (0, jwt_1.setAuthCookies)(res, response.refreshToken);
            res.status(statusCode_enum_1.StatusCode.CREATED).json({
                success: true,
                user: response.user,
                accessToken: response.accessToken,
            });
        });
    }
};
exports.UserAuthController = UserAuthController;
exports.UserAuthController = UserAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserAuthService)),
    __metadata("design:paramtypes", [Object])
], UserAuthController);
