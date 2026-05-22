import { Router } from "express";
import { TYPES } from "../types/types";
import { IUserChallengeController } from "../controllers/interfaces/user/IUserChallengeController";
import { container } from "../configs/inversify";
import { authMiddleware } from "../middlewares/auth.middleware";

const userChallengeController = container.get<IUserChallengeController>(
  TYPES.IUserChallengeController,
);

const router = Router();

/**
 * @route   GET /api/v1/challenges
 * @desc    Get all public challenges with filters and pagination
 * @access  Public
 */
router.get("/", userChallengeController.getChallenges);

/**
 * @route   GET /api/v1/challenges/featured
 * @desc    Get featured challenges for the home page
 * @access  Public
 */
router.get("/featured", userChallengeController.getFeaturedChallenges);

/**
 * @route   GET /api/v1/challenges/slug/:slug
 * @desc    Get challenge details by slug
 * @access  Public
 */
router.get("/slug/:slug", userChallengeController.getChallengeBySlug);
router.get("/:id", userChallengeController.getChallengeById);

/**
 * @route   POST /api/v1/challenges/:id/join
 * @desc    Join a challenge
 * @access  Private
 */
router.post("/:id/join", authMiddleware, userChallengeController.joinChallenge);

/**
 * @route   GET /api/v1/challenges/user/me
 * @desc    Get current user's enrolled challenges
 * @access  Private
 */
router.get("/user/me", authMiddleware, userChallengeController.getMyChallenges);

router.get("/:id/tasks", userChallengeController.getChallengeTasks);


router.post("/:id/tasks/toggle", authMiddleware, userChallengeController.toggleTaskCompletion);

export default router;
