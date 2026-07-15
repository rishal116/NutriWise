import express from "express";
import authRoutes from "./auth.route";
import profileRoutes from "./profile.route";
import healthRoutes from "./health.route";
import onboardingRoutes from "./onboarding.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/profile", profileRoutes);
router.use("/health", healthRoutes);

export default router;
