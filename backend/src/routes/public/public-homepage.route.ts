import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IPublicHomepageController } from "../../controllers/interfaces/public/IPublicHomepageController";

const router = Router();

const controller = container.get<IPublicHomepageController>(
  TYPES.IPublicHomepageController,
);

router.get("/nutritionists", controller.getFeaturedNutritionists);

router.get("/challenges", controller.getPopularChallenges);

router.get("/community-groups", controller.getPublicCommunityGroups);

router.get("/sessions", controller.getUpcomingSessions);

router.get("/posts", controller.getLatestCommunityPosts);

router.get("/resources", controller.getLatestResources);

router.get("/testimonials", controller.getLatestTestimonials);

export default router;
