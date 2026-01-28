import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../types/types";

// ---------------- USER ----------------
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { UserAuthController } from "../controllers/implementations/user/userAuth.controller";
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { UserAuthService } from "../services/implements/user/userAuth.service";
import { IOTPService } from "../services/interfaces/common/IOtpService";
import { OtpService } from "..//services/implements/common/otp.service";
import { IUserRepository } from "../repositories/interfaces/user/IUserRepository";
import { UserRepository } from "../repositories/implements/user/user.repository";
import { IOtpRepository } from "../repositories/interfaces/common/IOtpRepository";
import { OtpRepository } from "../repositories/implements/common/otp.repository";
import { NutritionistController } from "../controllers/implementations/user/nutritionists.controller";
import { INutritionistController } from "../controllers/interfaces/user/INutritionistsController";
import { NutritionistService } from "../services/implements/user/nutritionists.service";
import { INutritionistService } from "../services/interfaces/user/INutritionistsService";
import { IUserNutritionistProfileRepository } from "../repositories/interfaces/user/IUserNutritionistProfileRepository";
import { UserNutritionistRepository } from "../repositories/implements/user/userNutritionistProfile.repository";
import { UserProfileController } from "../controllers/implementations/user/userProfile.controller";
import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { IUserProfileService } from "../services/interfaces/user/IUserProfileService";
import { UserProfileService } from "../services/implements/user/userProfile.service";
import { IHealthDetailsController } from "../controllers/interfaces/user/IHealthDetailsController";
import { HealthDetailsController } from "../controllers/implementations/user/healthDetails.controller";
import { IHealthDetailsService } from "../services/interfaces/user/IHealthDetailsService";
import { HealthDetailsService } from "../services/implements/user/healthDetails.service";
import { HealthDetailsRepository } from "../repositories/implements/user/healthDetails.repository";
import { IHealthDetailsRepository } from "../repositories/interfaces/user/IHealthDetailsRepository";
import { IUserPlanRepository } from "../repositories/interfaces/user/IUserPlanRepository";
import { UserPlanRepository } from "../repositories/implements/user/userPlan.repository";
import { UserPlanController } from "../controllers/implementations/user/userPlan.controller";
import { IUserPlanController } from "../controllers/interfaces/user/IUserPlanController";
import { UserPlanService } from "../services/implements/user/userPlan.service";
import { IUserPlanService } from "../services/interfaces/user/IUserPlanService";
import { IUserAccountController } from "../controllers/interfaces/user/IUserAccountController";
import { UserAccountController } from "../controllers/implementations/user/userAccount.controller";
import { IUserAccountService } from "../services/interfaces/user/IUserAccountService";
import { UserAccountService } from "../services/implements/user/userAccount.service";


// ---------------- ADMIN ----------------
import { IAdminAuthController } from "../controllers/interfaces/admin/IAdminAuthController";
import { AdminAuthController } from "../controllers/implementations/admin/adminAuth.controller";
import { IAdminAuthService } from "../services/interfaces/admin/IAdminAuthService";
import { AdminAuthService } from "../services/implements/admin/adminAuth.service";
import { IAdminAuthRepository } from "../repositories/interfaces/admin/IAdminAuthRepository";
import { AdminAuthRepository } from "../repositories/implements/admin/admin.repository";

import { IAdminClientController } from "../controllers/interfaces/admin/IAdminClientController";
import { AdminClientController } from "../controllers/implementations/admin/adminClient.controller";
import { IAdminClientService } from "../services/interfaces/admin/IAdminClientService";
import { AdminClientService } from "../services/implements/admin/adminClient.service";
import { IAdminClientRepository } from "../repositories/interfaces/admin/IAdminClientRepository";
import { AdminClientRepository } from "../repositories/implements/admin/adminClient.repository";

import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { AdminNutritionistController } from "../controllers/implementations/admin/adminNutritionist.controller";
import { IAdminNutritionistService } from "../services/interfaces/admin/IAdminNutritionistService";
import { AdminNutritionistService } from "../services/implements/admin/adminNutritionist.service";
import { IAdminNutritionistRepository } from "../repositories/interfaces/admin/IAdminNutritionistRepository";
import { AdminNutritionistRepository } from "../repositories/implements/admin/adminNutritionist.repository";

import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { AdminNotificationController } from "../controllers/implementations/admin/adminNotification.controller";
import { INotificationService } from "../services/interfaces/admin/INotificationService";
import { NotificationService } from "../services/implements/admin/adminNotification.service";
import { INotificationRepository } from "../repositories/interfaces/common/INotificationRepository";
import { NotificationRepository } from "../repositories/implements/common/notification.repository";

import { IAdminPlanController } from "../controllers/interfaces/admin/IAdminPlanController";
import { AdminPlanController } from "../controllers/implementations/admin/adminPlan.controller";
import { IAdminPlanService } from "../services/interfaces/admin/IAdminPlanService";
import { AdminPlanService } from "../services/implements/admin/adminPlan.service";

// ---------------- NUTRITIONIST ----------------
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { NutritionistAuthController } from "../controllers/implementations/nutritionist/nutritionistAuth.controller";
import { INutritionistAuthService } from "../services/interfaces/nutritionist/INutritionistAuthService";
import { NutritionistAuthService } from "../services/implements/nutritionist/nutritionistAuth.service";

import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { NutritionistProfileController } from "../controllers/implementations/nutritionist/nutritionistProfile.controller";
import { INutritionistProfileService } from "../services/interfaces/nutritionist/INutritionistProfileService";
import { NutritionistProfileService } from "../services/implements/nutritionist/nutritionistProfile.service";
import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutritionistProfile.repository";

import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { NutritionistPlanController } from "../controllers/implementations/nutritionist/nutritionistPlan.controller";
import { INutritionistPlanService } from "../services/interfaces/nutritionist/INutritionistPlanService";
import { NutritionistPlanService } from "../services/implements/nutritionist/nutritionistPlan.service";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { NutritionistPlanRepository } from "../repositories/implements/nutritionist/nutritionistPlan.repository";
import { NutritionistSubscriptionController } from "../controllers/implementations/nutritionist/nutritionistSubscription.controller";
import { INutritionistSubscriptionController } from "../controllers/interfaces/nutritionist/INutritionistSubscriptionController";

// common
import { ICheckoutController } from "../controllers/interfaces/user/ICheckoutController";
import { CheckoutController } from "../controllers/implementations/user/checkout.controller";

import { ICheckoutService } from "../services/interfaces/user/ICheckoutService";
import { CheckoutService } from "../services/implements/user/checkout.service";

import { IStripeService } from "../services/interfaces/common/IStripeService";
import { StripeService } from "../services/implements/common/stripe.service";
import { IStripeWebhookService } from "../services/interfaces/common/IStripeWebhookService";
import { StripeWebhookService } from "../services/implements/common/stripeWebhook.service";
import { StripeWebhookController } from "../controllers/implementations/common/stripeWebhook.controller";
import { IStripeWebhookController } from "../controllers/interfaces/common/IStripeWebhookController";
// ---------------- CONTAINER ----------------
const container = new Container();

// -------- USER BINDINGS --------
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IOTPService>(TYPES.IOTPService).to(OtpService);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);
container.bind<INutritionistController>(TYPES.INutritionistController).to(NutritionistController);
container.bind<INutritionistService>(TYPES.INutritionistService).to(NutritionistService);
container.bind<IUserProfileController>(TYPES.IUserProfileController).to(UserProfileController);
container.bind<IUserProfileService>(TYPES.IUserProfileService).to(UserProfileService);
container.bind<IHealthDetailsController>(TYPES.IHealthDetailsController).to(HealthDetailsController);
container.bind<IHealthDetailsRepository>(TYPES.IHealthDetailsRepository).to(HealthDetailsRepository);
container.bind<IHealthDetailsService>(TYPES.IHealthDetailsService).to(HealthDetailsService);
container.bind<IUserPlanRepository>(TYPES.IUserPlanRepository).to(UserPlanRepository);
container.bind<IUserPlanController>(TYPES.IUserPlanController).to(UserPlanController)
container.bind<IUserPlanService>(TYPES.IUserPlanService).to(UserPlanService)
container.bind<IUserAccountService>(TYPES.IUserAccountService).to(UserAccountService)
container.bind<IUserAccountController>(TYPES.IUserAccountController).to(UserAccountController)

// -------- ADMIN BINDINGS --------
container.bind<IAdminAuthController>(TYPES.IAdminAuthController).to(AdminAuthController);
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container.bind<IAdminAuthRepository>(TYPES.IAdminAuthRepository).to(AdminAuthRepository);
container.bind<IAdminClientController>(TYPES.IAdminClientController).to(AdminClientController);
container.bind<IAdminClientService>(TYPES.IAdminClientService).to(AdminClientService);
container.bind<IAdminClientRepository>(TYPES.IAdminClientRepository).to(AdminClientRepository);
container.bind<IAdminNutritionistController>(TYPES.IAdminNutritionistController).to(AdminNutritionistController);
container.bind<IAdminNutritionistService>(TYPES.IAdminNutritionistService).to(AdminNutritionistService);
container.bind<IAdminNutritionistRepository>(TYPES.IAdminNutritionistRepository).to(AdminNutritionistRepository);
container.bind<IAdminNotificationController>(TYPES.IAdminNotificationController).to(AdminNotificationController);
container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService);
container.bind<INotificationRepository>(TYPES.INotificationRepository).to(NotificationRepository);
container.bind<IAdminPlanService>(TYPES.IAdminPlanService).to(AdminPlanService);
container.bind<IAdminPlanController>(TYPES.IAdminPlanController).to(AdminPlanController);

// -------- NUTRITIONIST BINDINGS --------
container.bind<INutritionistAuthController>(TYPES.INutritionistAuthController).to(NutritionistAuthController);
container.bind<INutritionistAuthService>(TYPES.INutritionistAuthService).to(NutritionistAuthService);
container.bind<IUserNutritionistProfileRepository>(TYPES.IUserNutritionistProfileRepository).to(UserNutritionistRepository);

container.bind<INutritionistProfileController>(TYPES.INutritionistProfileController).to(NutritionistProfileController);
container.bind<INutritionistProfileService>(TYPES.INutritionistProfileService).to(NutritionistProfileService);
container.bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository).to(NutritionistProfileRepository);


container.bind<INutritionistPlanController>(TYPES.INutritionistPlanController).to(NutritionistPlanController);
container.bind<INutritionistPlanService>(TYPES.INutritionistPlanService).to(NutritionistPlanService);
container.bind<INutritionistPlanRepository>(TYPES.INutritionistPlanRepository).to(NutritionistPlanRepository);

container.bind<INutritionistSubscriptionController>(TYPES.INutritionistSubscriptionController).to(NutritionistSubscriptionController);



// common
container.bind<ICheckoutService>(TYPES.ICheckoutService).to(CheckoutService);

container.bind<ICheckoutController>(TYPES.ICheckoutController).to(CheckoutController);

container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);
container.bind<IStripeWebhookService>(TYPES.IStripeWebhookService).to(StripeWebhookService);

container.bind<IStripeWebhookController>(TYPES.IStripeWebhookController).to(StripeWebhookController);







export { container };
