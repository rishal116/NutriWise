"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const adminAuth_dtos_1 = require("../../../dtos/admin/adminAuth.dtos");
class AdminAuthController {
    constructor(adminAuthService) {
        this.adminAuthService = adminAuthService;
    }
    async login(req, res, next) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(adminAuth_dtos_1.AdminLoginDto, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                res.status(400).json({
                    message: "Validation failed",
                    errors: errors.map(err => Object.values(err.constraints ?? {})).flat(),
                });
                return;
            }
            const result = await this.adminAuthService.login(dto);
            console.log(result);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const adminId = req.user?.id || "TEMP_ADMIN_ID";
            const result = await this.adminAuthService.getProfile(adminId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const adminId = req.user?.id || "TEMP_ADMIN_ID";
            const dto = Object.assign(new adminAuth_dtos_1.AdminChangePasswordDto(), req.body);
            const result = await this.adminAuthService.changePassword(adminId, dto);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const adminId = req.user?.id || "TEMP_ADMIN_ID";
            const result = await this.adminAuthService.logout(adminId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { token } = req.body;
            const result = await this.adminAuthService.refreshToken(token);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const dto = Object.assign(new adminAuth_dtos_1.AdminForgotPasswordDto(), req.body);
            const result = await this.adminAuthService.forgotPassword(dto);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            const result = await this.adminAuthService.verifyOtp(email, otp);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const dto = Object.assign(new adminAuth_dtos_1.AdminResetPasswordDto(), req.body);
            const result = await this.adminAuthService.resetPassword(dto);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminAuthController = AdminAuthController;
