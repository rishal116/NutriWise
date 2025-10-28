"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const inversify_1 = require("../configs/inversify");
const types_1 = require("../types/types");
const validateDto_middleware_1 = require("../middlewares/validateDto.middleware");
const UserAuth_dtos_1 = require("../dtos/user/UserAuth.dtos");
const router = express_1.default.Router();
const userAuthController = inversify_1.container.get(types_1.TYPES.IUserAuthController);
router.post("/signup", (0, validateDto_middleware_1.validateDto)(UserAuth_dtos_1.UserRegisterDto), userAuthController.register);
router.post("/verify-otp", (0, validateDto_middleware_1.validateDto)(UserAuth_dtos_1.VerifyOtpDto), userAuthController.verifyOtp);
router.post("/select-role", (0, validateDto_middleware_1.validateDto)(UserAuth_dtos_1.UserRoleDto), userAuthController.selectRole);
router.post("/resend-otp", (0, validateDto_middleware_1.validateDto)(UserAuth_dtos_1.ResendOtpDto), userAuthController.resendOtp);
exports.default = router;
