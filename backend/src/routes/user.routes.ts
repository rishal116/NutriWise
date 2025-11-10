import express from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";

const router = express.Router();

const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);

router.post("/signup", userAuthController.register);
router.post("/verify-otp",userAuthController.verifyOtp)
router.post("/resend-otp",userAuthController.resendOtp)
router.post("/login",userAuthController.login)
router.post("/google", userAuthController.googleLogin);
export default router;


