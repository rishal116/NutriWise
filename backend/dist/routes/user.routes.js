"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_1 = require("../configs/inversify");
const types_1 = require("../types/types");
const router = express_1.default.Router();
const userAuthController = inversify_1.container.get(types_1.TYPES.IUserAuthController);
router.post("/signup", userAuthController.register);
router.post("/verify-otp", userAuthController.verifyOtp);
router.post("/resend-otp", userAuthController.resendOtp);
router.post("/login", userAuthController.login);
router.post("/google", userAuthController.googleLogin);
exports.default = router;
