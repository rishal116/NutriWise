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
exports.NutritionistAuthController = void 0;
const asyncHandler_1 = require("../../../utils/asyncHandler");
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
const statusCode_enum_1 = require("../../../enums/statusCode.enum");
const logger_1 = __importDefault(require("../../../utils/logger"));
const jwt_1 = require("../../../utils/jwt");
let NutritionistAuthController = class NutritionistAuthController {
    constructor(_nutritionistAuthService) {
        this._nutritionistAuthService = _nutritionistAuthService;
        this.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { fullName, email, phone, password, confirmPassword } = req.body;
            logger_1.default.info(`User registration attempt - Email: ${email}`);
            const response = await this._nutritionistAuthService.signup(req, { fullName, email, phone, password, confirmPassword, });
            res.status(statusCode_enum_1.StatusCode.OK).json({ success: true, message: response.message });
        });
        this.verifyOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { email, otp } = req.body;
            logger_1.default.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
            const response = await this._nutritionistAuthService.verifyOtp(req, { email, otp });
            (0, jwt_1.setAuthCookies)(res, response.refreshToken);
            res.status(statusCode_enum_1.StatusCode.CREATED).json({ success: true, message: response.message, accessToken: response.accessToken, });
        });
        this.resendOtp = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { email } = req.body;
            logger_1.default.info(`Registration attempt - Email: ${email}`);
            const response = await this._nutritionistAuthService.resendOtp({ email });
            res.status(statusCode_enum_1.StatusCode.OK).json({ success: true, message: response.message });
        });
        this.submitDetails = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
            const { user } = req;
            logger_1.default.info(`Submit details attempt - Nutritionist ID: ${user.userId}`);
            const response = await this._nutritionistAuthService.submitDetails(req, user.userId);
            res.status(statusCode_enum_1.StatusCode.OK).json({ success: true, message: "Details submitted successfully", data: response, });
        });
    }
};
exports.NutritionistAuthController = NutritionistAuthController;
exports.NutritionistAuthController = NutritionistAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.INutritionistAuthService)),
    __metadata("design:paramtypes", [Object])
], NutritionistAuthController);
