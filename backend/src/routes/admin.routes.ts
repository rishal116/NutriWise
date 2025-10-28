import { Router } from "express";
import { AdminAuthController } from "../controllers/admin/implementation/adminAuth.controller";
import { AdminAuthService } from "../services/implements/admin/adminAuth.service";
import { AdminRepository } from "../repositories/implements/admin/admin.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const adminRepository = new AdminRepository();
const adminAuthService = new AdminAuthService(adminRepository);
const adminAuthController = new AdminAuthController(adminAuthService);




export default router;
