import express from "express";

import authRoutes from "./auth.route";

import profileRoutes from "./profile.route";

import healthRoutes from "./health.route";

import onboardingRoutes from "./onboarding.route";

import nutritionistBrowsingRoutes from "./nutri-browsing.route";

import nutritionistPlanBrowsingRoutes from "./nutri-plan-browsing.route";

import checkoutRoutes from "./checkout.route";

import userProgramRoutes from "./user-program.route";

import userProgramDayRoutes from "./user-program-day.route";

import userActivityTrackingRoutes from "./user-activity-track.route";

import userMeetingRoutes from "./user-meeting.route";

import userPostRoutes from "./user-post.route";

import userChallengeRoutes from "./user-challenge.route";

import userChallengeTrackingRoutes from "./user-challenge-tracking.route";

import userDashboardRouter from "./dashboard.route";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/onboarding", onboardingRoutes);

router.use("/profile", profileRoutes);

router.use("/health", healthRoutes);

router.use("/nutritionists", nutritionistPlanBrowsingRoutes);

router.use("/nutritionists", nutritionistBrowsingRoutes);

router.use("/checkout", checkoutRoutes);

router.use("/programs", userProgramRoutes);

router.use("/programs/:programId/days", userProgramDayRoutes);

router.use("/programs/:programId/days", userActivityTrackingRoutes);

router.use("/meetings", userMeetingRoutes);

router.use("/posts", userPostRoutes);

router.use("/challenges", userChallengeRoutes);

router.use("/challenges", userChallengeTrackingRoutes);

router.use("/dashboard", userDashboardRouter);

export default router;
