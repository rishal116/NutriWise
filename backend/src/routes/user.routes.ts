import express from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { refreshToken } from "../middlewares/refreshToken";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);

router.post("/signup", userAuthController.signup);
router.post("/verify-otp",userAuthController.verifyOtp)
router.post("/resend-otp",userAuthController.resendOtp)
router.post("/login",userAuthController.login)
router.post("/google", userAuthController.googleLogin);
router.post("/logout",userAuthController.logout)

router.post("/forgot-password", userAuthController.forgotPassword);
router.post("/reset-password", userAuthController.resetPassword);


router.post("/refresh-token", refreshToken);
router.get("/me",authMiddleware,userAuthController.getMe);
router.post("/google-signin", userAuthController.googleSignin);

export default router;


