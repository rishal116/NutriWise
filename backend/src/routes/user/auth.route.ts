import express from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { IUserAuthController } from "../../controllers/interfaces/user/IUserAuthController";

import { refreshToken } from "../../middlewares/refreshToken.middleware";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  authRateLimiter,
  otpRateLimiter,
  refreshRateLimiter,
} from "../../middlewares/rate-limit.middleware";

const router = express.Router();

const authController = container.get<IUserAuthController>(
  TYPES.IUserAuthController,
);

router.post("/signup", authRateLimiter, authController.signup);

router.post("/login", authRateLimiter, authController.login);

router.post("/google", authRateLimiter, authController.googleAuth);

router.post("/verify-otp", otpRateLimiter, authController.verifyOtp);

router.post("/resend-otp", otpRateLimiter, authController.resendOtp);

router.post("/forgot-password", authRateLimiter, authController.forgotPassword);

router.post("/reset-password", authRateLimiter, authController.resetPassword);

router.post("/refresh-token", refreshRateLimiter, refreshToken);

router.post("/logout", authController.logout);

router.get("/me", authMiddleware, authController.getMe);

router.patch("/switch-role", authMiddleware, authController.switchRole);

export default router;
