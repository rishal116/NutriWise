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
exports.AdminLoginResponseDto = exports.AdminResponseDto = exports.AdminResetPasswordDto = exports.AdminForgotPasswordDto = exports.AdminChangePasswordDto = exports.AdminLoginDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const BaseResponse_dtos_1 = require("../base/BaseResponse.dtos");
class AdminLoginDto {
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "Please provide a valid email address" }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "Password is required" }),
    (0, class_validator_1.MinLength)(1, { message: "Password cannot be empty" }),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
class AdminChangePasswordDto {
}
exports.AdminChangePasswordDto = AdminChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Old password is required' }),
    (0, class_validator_1.MinLength)(1, { message: 'Old password cannot be empty' }),
    __metadata("design:type", Object)
], AdminChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'New password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'New password must be at least 8 characters long' }),
    __metadata("design:type", Object)
], AdminChangePasswordDto.prototype, "newPassword", void 0);
class AdminForgotPasswordDto {
}
exports.AdminForgotPasswordDto = AdminForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", Object)
], AdminForgotPasswordDto.prototype, "email", void 0);
class AdminResetPasswordDto {
}
exports.AdminResetPasswordDto = AdminResetPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toLowerCase().trim()),
    __metadata("design:type", Object)
], AdminResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'OTP is required' }),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be 6 digits' }),
    __metadata("design:type", Object)
], AdminResetPasswordDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'New password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'New password must be at least 8 characters long' }),
    __metadata("design:type", Object)
], AdminResetPasswordDto.prototype, "newPassword", void 0);
class AdminResponseDto {
    constructor(admin) {
        this._id = admin._id;
        this.name = admin.name;
        this.email = admin.email;
        this.role = admin.role;
        this.isActive = admin.isActive ?? true;
        this.lastLogin = admin.lastLogin ?? null;
    }
}
exports.AdminResponseDto = AdminResponseDto;
class AdminLoginResponseDto extends BaseResponse_dtos_1.BaseResponseDto {
    constructor(admin, accessToken, refreshToken, message = 'Admin login successful') {
        super(true, message);
        this.admin = new AdminResponseDto(admin);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
exports.AdminLoginResponseDto = AdminLoginResponseDto;
