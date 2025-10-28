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
const tempUser_1 = require("../../../utils/tempUser");
const jwt_1 = require("../../../utils/jwt");
let UserAuthService = class UserAuthService {
    constructor(_userRepository, _otpService) {
        this._userRepository = _userRepository;
        this._otpService = _otpService;
    }
    async signup(data) {
        const { fullName, email, phone, password } = data;
        logger_1.default.info(`Signup request initiated for ${email}`);
        const existingUser = await this._userRepository.findByEmail(email);
        if (existingUser) {
            throw new customError_1.CustomError("User already exists", 409);
        }
        const tempUserData = { fullName, email, phone, password };
        await (0, tempUser_1.saveTempUser)(email, tempUserData);
        await this._otpService.requestOtp(email);
        logger_1.default.info(`OTP sent successfully to ${email}`);
        return { message: "OTP sent to your email. Please verify to complete signup." };
    }
    async verifyOtp(data) {
        const { email, otp } = data;
        logger_1.default.info(`Verifying OTP for ${email}`);
        const isValid = await this._otpService.verifyOtp(email, otp);
        if (!isValid) {
            throw new customError_1.CustomError("Invalid or expired OTP", statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        const tempUser = await (0, tempUser_1.findTempUserByEmail)(email);
        if (!tempUser) {
            throw new customError_1.CustomError("Temporary user data not found", statusCode_enum_1.StatusCode.NOT_FOUND);
        }
        const hashedPassword = await bcryptjs_1.default.hash(tempUser.password, 10);
        await this._userRepository.createUser({
            fullName: tempUser.fullName,
            email: tempUser.email,
            phone: tempUser.phone,
            password: hashedPassword,
            isVerified: true,
        });
        await (0, tempUser_1.deleteTempUser)(email);
        logger_1.default.info(`User verified and registered successfully: ${email}`);
        return {
            message: "Signup successful! Please select your role to complete your profile.",
        };
    }
    async selectUserRole(data) {
        const { email, role } = data;
        logger_1.default.info(`Role selection request for email: ${email} -> ${role}`);
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new customError_1.CustomError("User not found", statusCode_enum_1.StatusCode.NOT_FOUND);
        }
        user.role = role;
        await this._userRepository.updateUser(user._id, { role });
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        logger_1.default.info(`Role '${role}' assigned successfully for user: ${user.email}`);
        return {
            message: `Role '${role}' assigned successfully.`, accessToken, refreshToken,
        };
    }
};
exports.UserAuthService = UserAuthService;
exports.UserAuthService = UserAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IOTPService)),
    __metadata("design:paramtypes", [Object, Object])
], UserAuthService);
