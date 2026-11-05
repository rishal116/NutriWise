
import express from "express";
import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import type { IUserAuthController } from "../../controllers/interfaces/user/auth/IUserAuthController";
import type { IUserPasswordController } from "../../controllers/interfaces/user/auth/IUserPasswordController";
import type { IUserContextController } from "../../controllers/interfaces/user/auth/IUserContextController";
import type { IUserRoleController } from "../../controllers/interfaces/user/auth/IUserRoleController";

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

const passwordController = container.get<IUserPasswordController>(
  TYPES.IUserPasswordController,
);

const contextController = container.get<IUserContextController>(
  TYPES.IUserContextController,
);

const roleController = container.get<IUserRoleController>(
  TYPES.IUserRoleController,
);

router.post("/signup", authRateLimiter, authController.signup);

router.post("/login", authRateLimiter, authController.login);

router.post("/google", authRateLimiter, authController.googleAuth);

router.post("/verify-otp", otpRateLimiter, authController.verifyOtp);

router.post("/resend-otp", otpRateLimiter, authController.resendOtp);

router.post(
  "/forgot-password",
  authRateLimiter,
  passwordController.forgotPassword,
);

router.post(
  "/reset-password",
  authRateLimiter,
  passwordController.resetPassword,
);

router.post("/refresh-token", refreshRateLimiter, refreshToken);

router.post("/logout", authController.logout);

router.get("/me", authMiddleware, contextController.getMe);

router.patch("/switch-role", authMiddleware, roleController.switchRole);

export default router;
