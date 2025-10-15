"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthController = void 0;
class UserAuthController {
    constructor(userAuthService) {
        this.userAuthService = userAuthService;
    }
    async signup(req, res) {
        const result = await this.userAuthService.signup(req.body);
        res.status(201).json(result);
    }
    async signin(req, res) {
        const result = await this.userAuthService.signin(req.body);
        res.status(200).json(result);
    }
    async verifyOtp(req, res) {
        const result = await this.userAuthService.verifyOtp(req.body);
        res.status(200).json(result);
    }
    async forgotPassword(req, res) {
        const result = await this.userAuthService.forgotPassword(req.body.email);
        res.status(200).json(result);
    }
    async resetPassword(req, res) {
        const result = await this.userAuthService.resetPassword(req.body);
        res.status(200).json(result);
    }
}
exports.UserAuthController = UserAuthController;
