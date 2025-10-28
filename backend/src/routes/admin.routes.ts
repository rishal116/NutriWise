import { Router } from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IAdminAuthController } from "../controllers/admin/interface/IAdminAuthController.ts";
import { validateDto } from "../middlewares/validateDto.middleware";
import { AdminLoginDto,AdminForgotPasswordDto } from "../dtos/admin/adminAuth.dtos";

const router = Router();
const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);

router.post("/login", validateDto(AdminLoginDto), adminAuthController.login);
router.post("/forgot-password", validateDto(AdminForgotPasswordDto),adminAuthController.forgotPassword);

export default router;



