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
exports.UserAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const types_1 = require("../../../types/types");
const customError_1 = require("../../../utils/customError");
const statusCode_enum_1 = require("../../../enums/statusCode.enum");
const logger_1 = __importDefault(require("../../../utils/logger"));
const google_auth_library_1 = require("google-auth-library");
const validateDto_middleware_1 = require("../../../middlewares/validateDto.middleware");
const UserAuth_dto_1 = require("../../../dtos/user/UserAuth.dto");
const jwt_1 = require("../../../utils/jwt");
let UserAuthService = class UserAuthService {
    constructor(_userRepository, _otpService) {
        this._userRepository = _userRepository;
        this._otpService = _otpService;
        this._googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async signup(req, data) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.UserRegisterDto, data);
        const { fullName, email, phone, password } = data;
        logger_1.default.info(`Signup request initiated for ${email}`);
        const existingUser = await this._userRepository.findByEmail(email);
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
        const newUser = await this._userRepository.createUser({
            fullName: tempUser.fullName,
            email: tempUser.email,
            phone: tempUser.phone,
            password: hashedPassword,
            isVerified: true,
            role: "client",
        });
        logger_1.default.info(`User verified and registered successfully: ${email}`);
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(newUser._id.toString(), newUser.role || "client");
        delete req.session.tempUser;
        return { message: "Signup successful", accessToken, refreshToken, };
    }
    async resendOtp(data) {
        await (0, validateDto_middleware_1.validateDto)(UserAuth_dto_1.ResendOtpDto, data);
        const { email } = data;
        logger_1.default.info(`Resending OTP for ${email}`);
        const existingUser = await this._userRepository.findByEmail(email);
        if (existingUser && existingUser.isVerified) {
            throw new customError_1.CustomError("Account already verified", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        const response = await this._otpService.requestOtp(email);
        logger_1.default.info(`New OTP sent to ${email}`);
        return { message: response };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        const safeUser = {
            id: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        return { user: safeUser, accessToken, refreshToken };
    }
    async googleLogin(payload) {
        const { credential, role } = payload;
        const ticket = await this._googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const tokenPayload = ticket.getPayload();
        if (!tokenPayload)
            throw new Error("Invalid Google token");
        let user = await this._userRepository.findByGoogleId(tokenPayload.sub);
        if (!user) {
            user = await this._userRepository.createUser({
                fullName: tokenPayload.name || "",
                email: tokenPayload.email || "",
                googleId: tokenPayload.sub,
                role,
                isVerified: true,
            });
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        const safeUser = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };
        return { user: safeUser, accessToken, refreshToken };
    }
};
exports.UserAuthService = UserAuthService;
exports.UserAuthService = UserAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __metadata("design:paramtypes", [Object, Object])
], UserAuthService);
