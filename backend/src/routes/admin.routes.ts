import { Router } from "express";
import { AdminAuthController } from "../controllers/admin/implementation/adminAuth.controller";
import { AdminAuthService } from "../services/admin/implementation/adminAuth.service";
import { AdminAuthRepository } from "../repositories/admin/implementation/adminAuth.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const adminRepository = new AdminAuthRepository();
const adminAuthService = new AdminAuthService(adminRepository);
const adminAuthController = new AdminAuthController(adminAuthService);

router.post("/login", adminAuthController.login.bind(adminAuthController));
router.get("/profile", authMiddleware, (req, res, next) => adminAuthController.getProfile(req, res, next));
router.post("/change-password", authMiddleware, (req, res, next) => adminAuthController.changePassword(req, res, next));
router.post("/logout", authMiddleware, (req, res, next) => adminAuthController.logout(req, res, next));

export default router;
