import express from "express";

import authRoutes from "./auth.route";
import profileRoutes from "./profile.route";
import healthRoutes from "./health.route";
import onboardingRoutes from "./onboarding.route";

import nutritionistBrowsingRoutes from "./nutri-browsing.route";
import nutritionistPlanBrowsingRoutes from "./nutri-plan-browsing.route";

import checkoutRoutes from "./checkout.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/profile", profileRoutes);
router.use("/health", healthRoutes);

router.use("/nutritionists", nutritionistPlanBrowsingRoutes);
router.use("/nutritionists", nutritionistBrowsingRoutes);

router.use("/checkout", checkoutRoutes);

export default router;
