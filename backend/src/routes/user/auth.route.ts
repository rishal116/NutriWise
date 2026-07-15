import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IUserAuthController } from "../../controllers/interfaces/user/IUserAuthController";
import { refreshToken } from "../../middlewares/refreshToken.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

const authController = container.get<IUserAuthController>(
  TYPES.IUserAuthController,
);

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

router.post("/login", authController.login);
router.post("/google", authController.googleAuth);
router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/refresh-token", refreshToken);

router.get("/me", authMiddleware, authController.getMe);

router.patch("/switch-role", authMiddleware, authController.switchRole);

export default router;
