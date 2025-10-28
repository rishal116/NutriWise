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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = exports.RegisterResponseDto = exports.UserRoleDto = exports.ResendOtpDto = exports.VerifyOtpDto = exports.RequestOtpDto = exports.UserRegisterDto = void 0;
const class_validator_1 = require("class-validator");
class UserRegisterDto {
}
exports.UserRegisterDto = UserRegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Full name is required" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Phone number is required" }),
    (0, class_validator_1.Matches)(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 6 characters" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Confirm password is required" }),
    (0, class_validator_1.MinLength)(8, { message: "Confirm password must be at least 8 characters" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "confirmPassword", void 0);
// ✅ OTP Request
class RequestOtpDto {
}
exports.RequestOtpDto = RequestOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], RequestOtpDto.prototype, "email", void 0);
// ✅ OTP Verification
class VerifyOtpDto {
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "OTP is required" }),
    (0, class_validator_1.Matches)(/^[0-9]{6}$/, { message: "OTP must be 6 digits" }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
class ResendOtpDto {
}
exports.ResendOtpDto = ResendOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], ResendOtpDto.prototype, "email", void 0);
// ✅ Role Selection
class UserRoleDto {
}
exports.UserRoleDto = UserRoleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], UserRoleDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Role is required" }),
    (0, class_validator_1.IsEnum)(["user", "admin", "nutritionist"], { message: "Role must be one of: user, trainer, nutritionist" }),
    __metadata("design:type", String)
], UserRoleDto.prototype, "role", void 0);
// ✅ Response DTOs
class RegisterResponseDto {
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}
exports.RegisterResponseDto = RegisterResponseDto;
class LoginResponseDto {
    constructor(success, message, user, accessToken, refreshToken) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
exports.LoginResponseDto = LoginResponseDto;
