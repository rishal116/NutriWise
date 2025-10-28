// src/routes/userRoutes.ts
import express from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IUserAuthController } from "../controllers/user/interface/IUserAuthController";
import { validateDto } from "../middlewares/validateDto.middleware";
import { ResendOtpDto, UserRegisterDto, UserRoleDto, VerifyOtpDto } from "../dtos/user/UserAuth.dtos";

const router = express.Router();

const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);

router.post("/signup", validateDto(UserRegisterDto), userAuthController.register);
router.post("/verify-otp",validateDto(VerifyOtpDto),userAuthController.verifyOtp)
router.post("/select-role",validateDto(UserRoleDto),userAuthController.selectRole)
router.post("/resend-otp",validateDto(ResendOtpDto),userAuthController.resendOtp)

export default router;


