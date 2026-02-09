import express from "express";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { INutritionistController } from "../controllers/interfaces/user/INutritionistsController";
import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { refreshToken } from "../middlewares/refreshToken.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ICheckoutController } from "../controllers/interfaces/user/ICheckoutController";
import { IStripeWebhookController } from "../controllers/interfaces/common/IStripeWebhookController";
import { IHealthDetailsController } from "../controllers/interfaces/user/IHealthDetailsController";
import { IUserPlanController } from "../controllers/interfaces/user/IUserPlanController";
import { upload } from "../middlewares/multer.middleware";
import { IChatController } from "../controllers/interfaces/chat/IChatController";
import { IUserAccountController } from "../controllers/interfaces/user/IUserAccountController";
import { blockLoggedInUser } from "../middlewares/blockLoggedInUser.middleware";



const router = express.Router();

const profileController = container.get<IUserProfileController>(TYPES.IUserProfileController);
const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);
const nutritionistController = container.get<INutritionistController>(TYPES.INutritionistController);
const checkoutController = container.get<ICheckoutController>(TYPES.ICheckoutController)
const stripeController = container.get<IStripeWebhookController>(TYPES.IStripeWebhookController)
const healthDetailsController = container.get<IHealthDetailsController>(TYPES.IHealthDetailsController)
const userPlanController = container.get<IUserPlanController>(TYPES.IUserPlanController)
const userAccountController = container.get<IUserAccountController>(TYPES.IUserAccountController)
const chatController = container.get<IChatController>(TYPES.IChatController)

router.post("/signup", userAuthController.signup);
router.post("/verify-otp",userAuthController.verifyOtp)
router.post("/resend-otp",userAuthController.resendOtp)
router.post("/login",userAuthController.login)
router.post("/google", userAuthController.googleLogin);
router.post("/logout",userAuthController.logout)
router.post("/forgot-password", userAuthController.forgotPassword);
router.post("/reset-password", userAuthController.resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/me",authMiddleware,blockLoggedInUser,userAuthController.getMe);
router.post("/google-signin", userAuthController.googleSignin);

router.get("/profile", authMiddleware,profileController.getProfile);
router.put("/profile", authMiddleware, profileController.updateProfile);
router.post("/profile/upload-image",authMiddleware,upload.single("image"),profileController.updateUserProfileImage)
router.get("/profile/upload-image",authMiddleware,profileController.getUserProfileImage)

router.get("/nutritionists",nutritionistController.getAllNutritionists);
router.get("/nutritionists/:nutritionistId",nutritionistController.getNutritionistById);
router.get("/nutritionists/:nutritionistId/plans", nutritionistController.getNutritionistPlans);

router.post("/checkout/session",authMiddleware, authMiddleware,checkoutController.createSession);
router.post("/stripe/webhook",authMiddleware,express.raw({ type: "application/json" }),stripeController.handle);
router.get("/health-details", authMiddleware, healthDetailsController.getMyDetails);
router.post("/health-details", authMiddleware,authMiddleware,healthDetailsController.saveDetails);
router.get("/plans",authMiddleware,userPlanController.getMyPlans)
router.get("/plans/:planId",authMiddleware,userPlanController.getPlanById)

router.post("/chat/conversation",authMiddleware,chatController.createDirectConversation)

router.post("/change-password",authMiddleware,userAccountController.changePassword)

export default router;


