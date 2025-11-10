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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const asyncHandler_1 = require("../../../utils/asyncHandler");
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
let AdminAuthController = class AdminAuthController {
    constructor(_adminAuthService) {
        this._adminAuthService = _adminAuthService;
        this.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const result = await this._adminAuthService.login(req.body);
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                admin: result.admin,
                accessToken: result.accessToken,
            });
        });
        this.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const result = await this._adminAuthService.forgotPassword(req.body);
            res.status(200).json(result);
        });
    }
};
exports.AdminAuthController = AdminAuthController;
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminAuthService)),
    __metadata("design:paramtypes", [Object])
], AdminAuthController);
