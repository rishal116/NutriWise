// ======================================================
// IMPORTS
// ======================================================

// ---------- External ----------
import "reflect-metadata";
import { Container } from "inversify";

// ---------- User Module ----------
// ---------- Controllers ----------
import { HealthDetailsController } from "../controllers/implementations/user/healthDetails.controller";
import { HealthProgressController } from "../controllers/implementations/user/healthProgress.controller";
import { NutritionistBrowsingController } from "../controllers/implementations/user/nutriBrowsing.controller";
import { NutritionistPlanBrowsingController } from "../controllers/implementations/user/nutriPlanBrowsing.controller";
import { OnboardingController } from "../controllers/implementations/user/onboarding.controller";
import { ReviewController } from "../controllers/implementations/user/review.controller";
import { UserAccountController } from "../controllers/implementations/user/userAccount.controller";
import { UserAuthController } from "../controllers/implementations/user/userAuth.controller";
import { UserGroupController } from "../controllers/implementations/user/userGroup.controller";
import { UserMeetingsController } from "../controllers/implementations/user/userMeetings.controller";
import { UserProfileController } from "../controllers/implementations/user/userProfile.controller";
import { UserProgramController } from "../controllers/implementations/user/userProgram.controller";
import { UserProgramDayController } from "../controllers/implementations/user/userProgramDay.controller";
// ---------- Services ----------
import { HealthDetailsService } from "../services/implements/user/healthDetails.service";
import { HealthProgressService } from "../services/implements/user/healthProgress.service";
import { NutritionistBrowsingService } from "../services/implements/user/discovery/nutriBrowsing.service";
import { NutritionistPlanBrowsingService } from "../services/implements/user/discovery/nutriPlanBrowsing.service";
import { OnboardingService } from "../services/implements/user/onboarding.service";
import { ReviewService } from "../services/implements/user/review.service";
import { UserAccountService } from "../services/implements/user/userAccount.service";
import { UserAuthService } from "../services/implements/user/userAuth.service";
import { UserGroupService } from "../services/implements/user/userGroup.service";
import { UserMeetingsService } from "../services/implements/user/userMeetings.service";
import { UserProfileService } from "../services/implements/user/userProfile.service";
import { UserProgramService } from "../services/implements/user/program/userProgram.service";
import { UserProgramDayService } from "../services/implements/user/program/userProgramDay.service";
// ---------- Repositories ----------
import { HealthDetailsRepository } from "../repositories/implements/user/account/healthDetails.repository";
import { HealthProgressRepository } from "../repositories/implements/user/account/healthProgress.repository";
import { NutritionistBrowsingRepository } from "../repositories/implements/user/discovery/nutriBrowsing.repository";
import { NutritionistPlanBrowsingRepository } from "../repositories/implements/user/discovery/nutriPlanBrowsing.repository";
import { UserProgramDayRepository } from "../repositories/implements/user/program/userProgramDay.repository";
import { ReviewRepository } from "../repositories/implements/user/discovery/review.repository";
import { UserProgramRepository } from "../repositories/implements/user/program/userProgram.repository";
import { UserRepository } from "../repositories/implements/user/account/user.repository";
import { UserPlanRepository } from "../repositories/implements/user/program/userPlan.repository";
// ---------- Interfaces ----------
import { IHealthDetailsController } from "../controllers/interfaces/user/IHealthDetailsController";
import { IHealthDetailsRepository } from "../repositories/interfaces/user/account/IHealthDetailsRepository";
import { IHealthDetailsService } from "../services/interfaces/user/account/IHealthDetailsService";
import { IHealthProgressController } from "../controllers/interfaces/user/IHealthProgressController";
import { IHealthProgressRepository } from "../repositories/interfaces/user/account/IHealthProgressRepository";
import { IHealthProgressService } from "../services/interfaces/user/account/IHealthProgress.Service";
import { INutritionistBrowsingController } from "../controllers/interfaces/user/INutriBrowsingController";
import { INutritionistBrowsingRepository } from "../repositories/interfaces/user/discovery/INutriBrowsingRepository";
import { INutritionistBrowsingService } from "../services/interfaces/user/discovery/INutriBrowsingService";
import { INutritionistPlanBrowsingController } from "../controllers/interfaces/user/INutritionistPlanBrowsingController";
import { INutritionistPlanBrowsingRepository } from "../repositories/interfaces/user/discovery/INutriPlanBrowsingRepository";
import { INutritionistPlanBrowsingService } from "../services/interfaces/user/discovery/INutritionistPlanBrowsingService";
import { IOnboardingController } from "../controllers/interfaces/user/IOnboardingController";
import { IOnboardingService } from "../services/interfaces/user/IOnboardingService";
import { IUserProgramDayRepository } from "../repositories/interfaces/user/program/IUserProgramDayRepository";
import { IReviewController } from "../controllers/interfaces/user/IReviewController";
import { IReviewRepository } from "../repositories/interfaces/user/discovery/IReviewRepository";
import { IReviewService } from "../services/interfaces/user/IReviewService";
import { IUserAccountController } from "../controllers/interfaces/user/IUserAccountController";
import { IUserAccountService } from "../services/interfaces/user/IUserAccountService";
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { IUserGroupController } from "../controllers/interfaces/user/IUserGroupController";
import { IUserGroupService } from "../services/interfaces/user/IUserGroupService";
import { IUserMeetingsController } from "../controllers/interfaces/user/IUserMeetingsController";
import { IUserMeetingsService } from "../services/interfaces/user/IUserMeetingsService";
import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { IUserProfileService } from "../services/interfaces/user/IUserProfileService";
import { IUserProgramController } from "../controllers/interfaces/user/IUserProgramController";
import { IUserProgramRepository } from "../repositories/interfaces/user/program/IUserProgramRepository";
import { IUserProgramService } from "../services/interfaces/user/program/IUserProgramService";
import { IUserRepository } from "../repositories/interfaces/user/account/IUserRepository";
import { IUserProgramDayController } from "../controllers/interfaces/user/IUserProgramDayController";
import { IUserProgramDayService } from "../services/interfaces/user/program/IUserProgramDayService";
import { IUserPlanRepository } from "../repositories/interfaces/user/program/IUserPlanRepository";

// ---------- Admin Module ----------
// ---------- Controllers ----------
import { AdminNutritionistApplicationController } from "../controllers/implementations/admin/adminNutritionistApplication.controller";
import { AdminNutritionistController } from "../controllers/implementations/admin/adminNutritionist.controller";
import { AdminUserController } from "../controllers/implementations/admin/adminUser.controller";
// ---------- Services ----------
import { AdminNutritionistApplicationService } from "../services/implements/admin/adminNutritionistApplication.service";
import { AdminNutritionistService } from "../services/implements/admin/adminNutritionist.service";
import { AdminUserService } from "../services/implements/admin/adminUser.service";
// ---------- Repositories ----------
import { AdminNutritionistApplicationRepository } from "../repositories/implements/admin/adminNutritionistApplication.repository";
import { AdminNutritionistRepository } from "../repositories/implements/admin/adminNutritionist.repository";
import { AdminUserRepository } from "../repositories/implements/admin/adminUser.repository";
// ---------- Interfaces ----------
import { IAdminNutritionistApplicationController } from "../controllers/interfaces/admin/IAdminNutritionistApplicationController";
import { IAdminNutritionistApplicationRepository } from "../repositories/interfaces/admin/IAdminNutritionistApplicationRepository";
import { IAdminNutritionistApplicationService } from "../services/interfaces/admin/IAdminNutritionistApplicationService";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { IAdminNutritionistRepository } from "../repositories/interfaces/admin/IAdminNutritionistRepository";
import { IAdminNutritionistService } from "../services/interfaces/admin/IAdminNutritionistService";
import { IAdminUserController } from "../controllers/interfaces/admin/IAdminUserController";
import { IAdminUserRepository } from "../repositories/interfaces/admin/IAdminUserRepository";
import { IAdminUserService } from "../services/interfaces/admin/IAdminUserService";

// ---------- Nutritionist Module ----------
// ---------- Controllers ----------
import { NutriGroupController } from "../controllers/implementations/nutritionist/nutriGroup.controller";
import { NutriMeetingsController } from "../controllers/implementations/nutritionist/nutriMeetings.controller";
import { NutriProgramController } from "../controllers/implementations/nutritionist/nutriProgram.controller";
import { NutritionistApplicationController } from "../controllers/implementations/nutritionist/nutriApplication.controller";
import { NutritionistPlanController } from "../controllers/implementations/nutritionist/nutriPlan.controller";
import { NutriClientController } from "../controllers/implementations/nutritionist/nutriClient.controller";
// ---------- Services ----------
import { NutriGroupService } from "../services/implements/nutritionist/nutriGroup.service";
import { NutriMeetingsService } from "../services/implements/nutritionist/nutriMeetings.service";
import { NutriProgramService } from "../services/implements/nutritionist/nutriProgram.service";
import { NutriClientService } from "../services/implements/nutritionist/nutriClient.service";
import { NutritionistApplicationService } from "../services/implements/nutritionist/nutriApplication.service";
import { NutritionistPlanService } from "../services/implements/nutritionist/nutriPlan.service";
// ---------- Repositories ----------
import { NutriMeetingsRepository } from "../repositories/implements/nutritionist/nutriMeetings.repository";
import { NutritionistPlanRepository } from "../repositories/implements/nutritionist/nutriPlan.repository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutriProfile.repository";
// ---------- Interfaces ----------
import { INutriGroupController } from "../controllers/interfaces/nutritionist/INutriGroupController";
import { INutriGroupService } from "../services/interfaces/nutritionist/INutriGroupService";
import { INutriMeetingsController } from "../controllers/interfaces/nutritionist/INutriMeetingsController";
import { INutriMeetingsRepository } from "../repositories/interfaces/nutritionist/INutriMeetingsRepository";
import { INutriMeetingsService } from "../services/interfaces/nutritionist/INutriMeetingsService";
import { INutriProgramController } from "../controllers/interfaces/nutritionist/INutriProgramController";
import { INutriProgramService } from "../services/interfaces/nutritionist/INutriProgramService";
import { INutriClientService } from "../services/interfaces/nutritionist/INutriClientService";
import { INutritionistApplicationController } from "../controllers/interfaces/nutritionist/INutriApplicationController";
import { INutritionistApplicationService } from "../services/interfaces/nutritionist/INutriApplicationService";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutriPlanController";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutriPlanRepository";
import { INutritionistPlanService } from "../services/interfaces/nutritionist/INutriPlanService";
import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutriProfileRepository";

// ---------- Chat Module ----------
// ---------- Controllers ----------
import { ConversationController } from "../controllers/implementations/chat/conversation.controller";
import { MessageController } from "../controllers/implementations/chat/message.controller";
// ---------- Services ----------
import { ConversationService } from "../services/implements/chat/conversation.service";
import { MessageService } from "../services/implements/chat/message.service";
// ---------- Repositories ----------
import { ConversationMemberRepository } from "../repositories/implements/chat/conversationMember.repository";
import { ConversationRepository } from "../repositories/implements/chat/conversation.repository";
import { MessageReceiptRepository } from "../repositories/implements/chat/messageReceipt.repository";
import { MessageRepository } from "../repositories/implements/chat/message.repository";
// ---------- Interfaces ----------
import { IConversationController } from "../controllers/interfaces/chat/IConversationController";
import { IConversationMemberRepository } from "../repositories/interfaces/chat/IConversationMemberRepository";
import { IConversationRepository } from "../repositories/interfaces/chat/IConversationRepository";
import { IConversationService } from "../services/interfaces/chat/IConversationService";
import { IMessageController } from "../controllers/interfaces/chat/IMessageController";
import { IMessageReceiptRepository } from "../repositories/interfaces/chat/IMessageReceiptRepository";
import { IMessageRepository } from "../repositories/interfaces/chat/IMessageRepository";
import { IMessageService } from "../services/interfaces/chat/IMessageService";

// ---------- Common Module ----------
// ---------- Controllers ----------
import { CheckoutController } from "../controllers/implementations/user/checkout.controller";
import { StripeWebhookController } from "../controllers/implementations/common/stripeWebhook.controller";
// ---------- Services ----------
import { CheckoutService } from "../services/implements/user/checkout.service";
import { NotificationService } from "../services/implements/common/notification.service";
import { OtpService } from "..//services/implements/common/otp.service";
import { StripeService } from "../services/implements/common/stripe/stripe.service";
import { StripeWebhookService } from "../services/implements/common/stripe/stripeWebhook.service";
import { StripeCheckoutHandlerService } from "../services/implements/common/stripe/stripeCheckoutHandler.service";
// ---------- Repositories ----------
import { NotificationRepository } from "../repositories/implements/common/notification.repository";
import { OtpRepository } from "../repositories/implements/common/otp.repository";
import { PasswordResetRepository } from "../repositories/implements/common/passwordReset.repository";
import { PaymentRepository } from "../repositories/implements/common/payment.repository";
import { WalletRepository } from "../repositories/implements/common/wallet.repository";
// ---------- Interfaces ----------
import { ICheckoutController } from "../controllers/interfaces/user/ICheckoutController";
import { ICheckoutService } from "../services/interfaces/user/ICheckoutService";
import { INotificationRepository } from "../repositories/interfaces/common/INotificationRepository";
import { INotificationService } from "../services/interfaces/common/INotificationService";
import { IOtpRepository } from "../repositories/interfaces/common/IOtpRepository";
import { IOTPService } from "../services/interfaces/common/IOtpService";
import { IPasswordResetRepository } from "../repositories/interfaces/common/IPasswordResetRepository";
import { IPaymentRepository } from "../repositories/interfaces/common/IPaymentRepository";
import { IStripeService } from "../services/interfaces/common/stripe/IStripeService";
import { IStripeWebhookController } from "../controllers/interfaces/common/IStripeWebhookController";
import { IStripeWebhookService } from "../services/interfaces/common/stripe/IStripeWebhookService";
import { IWalletRepository } from "../repositories/interfaces/common/IWalletRepository";
import { IStripeCheckoutHandlerService } from "../services/interfaces/common/stripe/IStripeCheckoutHandlerService";

// ---------- Socket ----------
import { ISocketService } from "../services/interfaces/socket/ISocketService";
import { SocketService } from "../services/implements/socket/socket.service";

// ---------- Types ----------
import { TYPES } from "../types/types";
import { INutriClientController } from "../controllers/interfaces/nutritionist/INutriClientController";
import { INutriClientRepository } from "../repositories/interfaces/nutritionist/INutriClientRepository";
import { NutriClientRepository } from "../repositories/implements/nutritionist/nutriClient.repository";

// latest
import { INutriProgramRepository } from "../repositories/interfaces/nutritionist/INutriProgramRepository";
import { NutriProgramRepository } from "../repositories/implements/nutritionist/nutriProgram.repository";
import { NutriProgramDayService } from "../services/implements/nutritionist/nutriProgramDay.service";
import { INutriProgramDayService } from "../services/interfaces/nutritionist/INutriProgramDayService";
import { INutriProgramDayController } from "../controllers/interfaces/nutritionist/INutriProgramDayController";
import { NutriProgramDayController } from "../controllers/implementations/nutritionist/nutriProgramDay.controller";
import { INutriProgramDayRepository } from "../repositories/interfaces/nutritionist/INutriProgramDayRepository";
import { NutriProgramDayRepository } from "../repositories/implements/nutritionist/nutriProgramDay.repository";
import { IUserProgramBrowseRepository } from "../repositories/interfaces/user/program/IUserProgramBrowseRepository";
import { UserProgramBrowseRepository } from "../repositories/implements/user/program/userProgramBrowse.repository";
import { IUserProgramProgressRepository } from "../repositories/interfaces/user/tracking/IUserProgramProgressRepository";
import { UserProgramProgressRepository } from "../repositories/implements/user/tracking/userProgramProgress.repository";

// ======================================================
// CONTAINER
// ======================================================

const container = new Container();

// ======================================================
// USER BINDINGS
// ======================================================

// ---------- Controllers ----------
container
  .bind<IUserProgramController>(TYPES.IUserProgramController)
  .to(UserProgramController);
container
  .bind<IUserProgramService>(TYPES.IUserProgramService)
  .to(UserProgramService);
container
  .bind<IUserProgramBrowseRepository>(TYPES.IUserProgramBrowseRepository)
  .to(UserProgramBrowseRepository);
container
  .bind<IUserProgramRepository>(TYPES.IUserProgramRepository)
  .to(UserProgramRepository);
container
  .bind<IUserProgramProgressRepository>(TYPES.IUserProgramProgressRepository)
  .to(UserProgramProgressRepository);
container
  .bind<IHealthDetailsController>(TYPES.IHealthDetailsController)
  .to(HealthDetailsController);

container
  .bind<IHealthProgressController>(TYPES.IHealthProgressController)
  .to(HealthProgressController);

container
  .bind<INutritionistBrowsingController>(TYPES.INutritionistBrowsingController)
  .to(NutritionistBrowsingController);

container
  .bind<INutritionistPlanBrowsingController>(
    TYPES.INutritionistPlanBrowsingController,
  )
  .to(NutritionistPlanBrowsingController);

container
  .bind<IOnboardingController>(TYPES.IOnboardingController)
  .to(OnboardingController);

container.bind<IReviewController>(TYPES.IReviewController).to(ReviewController);

container
  .bind<IUserAccountController>(TYPES.IUserAccountController)
  .to(UserAccountController);

container
  .bind<IUserAuthController>(TYPES.IUserAuthController)
  .to(UserAuthController);

container
  .bind<IUserGroupController>(TYPES.IUserGroupController)
  .to(UserGroupController);

container
  .bind<IUserMeetingsController>(TYPES.IUserMeetingsController)
  .to(UserMeetingsController);

container
  .bind<IUserProfileController>(TYPES.IUserProfileController)
  .to(UserProfileController);

// ---------- Services ----------
container
  .bind<IHealthDetailsService>(TYPES.IHealthDetailsService)
  .to(HealthDetailsService);

container
  .bind<IHealthProgressService>(TYPES.IHealthProgressService)
  .to(HealthProgressService);

container
  .bind<INutritionistBrowsingService>(TYPES.INutritionistBrowsingService)
  .to(NutritionistBrowsingService);

container
  .bind<INutritionistPlanBrowsingService>(
    TYPES.INutritionistPlanBrowsingService,
  )
  .to(NutritionistPlanBrowsingService);

container
  .bind<IOnboardingService>(TYPES.IOnboardingService)
  .to(OnboardingService);

container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService);

container
  .bind<IUserAccountService>(TYPES.IUserAccountService)
  .to(UserAccountService);

container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);

container.bind<IUserGroupService>(TYPES.IUserGroupService).to(UserGroupService);

container
  .bind<IUserMeetingsService>(TYPES.IUserMeetingsService)
  .to(UserMeetingsService);

container
  .bind<IUserProfileService>(TYPES.IUserProfileService)
  .to(UserProfileService);

// ---------- Repositories ----------
container
  .bind<IHealthDetailsRepository>(TYPES.IHealthDetailsRepository)
  .to(HealthDetailsRepository);

container
  .bind<IHealthProgressRepository>(TYPES.IHealthProgressRepository)
  .to(HealthProgressRepository);

container
  .bind<INutritionistBrowsingRepository>(TYPES.INutritionistBrowsingRepository)
  .to(NutritionistBrowsingRepository);

container
  .bind<INutritionistPlanBrowsingRepository>(
    TYPES.INutritionistPlanBrowsingRepository,
  )
  .to(NutritionistPlanBrowsingRepository);

container
  .bind<IUserProgramDayRepository>(TYPES.IUserProgramDayRepository)
  .to(UserProgramDayRepository);

container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository);

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container
  .bind<IUserProgramDayController>(TYPES.IUserProgramDayController)
  .to(UserProgramDayController);
container
  .bind<IUserProgramDayService>(TYPES.IUserProgramDayService)
  .to(UserProgramDayService);
container
  .bind<IUserPlanRepository>(TYPES.IUserPlanRepository)
  .to(UserPlanRepository);
// ======================================================
// ADMIN BINDINGS
// ======================================================

// ---------- Controllers ----------
container
  .bind<IAdminNutritionistApplicationController>(
    TYPES.IAdminNutritionistApplicationController,
  )
  .to(AdminNutritionistApplicationController);

container
  .bind<IAdminNutritionistController>(TYPES.IAdminNutritionistController)
  .to(AdminNutritionistController);

container
  .bind<IAdminUserController>(TYPES.IAdminUserController)
  .to(AdminUserController);

// ---------- Services ----------
container
  .bind<IAdminNutritionistApplicationService>(
    TYPES.IAdminNutritionistApplicationService,
  )
  .to(AdminNutritionistApplicationService);

container
  .bind<IAdminNutritionistService>(TYPES.IAdminNutritionistService)
  .to(AdminNutritionistService);

container.bind<IAdminUserService>(TYPES.IAdminUserService).to(AdminUserService);

// ---------- Repositories ----------
container
  .bind<IAdminNutritionistApplicationRepository>(
    TYPES.IAdminNutritionistApplicationRepository,
  )
  .to(AdminNutritionistApplicationRepository);

container
  .bind<IAdminNutritionistRepository>(TYPES.IAdminNutritionistRepository)
  .to(AdminNutritionistRepository);

container
  .bind<IAdminUserRepository>(TYPES.IAdminUserRepository)
  .to(AdminUserRepository);

// ======================================================
// NUTRITIONIST BINDINGS
// ======================================================

// ---------- Controllers ----------
container
  .bind<INutriGroupController>(TYPES.INutriGroupController)
  .to(NutriGroupController);

container
  .bind<INutriMeetingsController>(TYPES.INutriMeetingsController)
  .to(NutriMeetingsController);

container
  .bind<INutriProgramController>(TYPES.INutriProgramController)
  .to(NutriProgramController);

container
  .bind<INutritionistApplicationController>(
    TYPES.INutritionistApplicationController,
  )
  .to(NutritionistApplicationController);

container
  .bind<INutritionistPlanController>(TYPES.INutritionistPlanController)
  .to(NutritionistPlanController);

container
  .bind<INutriClientController>(TYPES.INutriClientController)
  .to(NutriClientController);

// ---------- Services ----------
container
  .bind<INutriGroupService>(TYPES.INutriGroupService)
  .to(NutriGroupService);

container
  .bind<INutriMeetingsService>(TYPES.INutriMeetingsService)
  .to(NutriMeetingsService);

container
  .bind<INutriProgramService>(TYPES.INutriProgramService)
  .to(NutriProgramService);

container
  .bind<INutriClientService>(TYPES.INutriClientService)
  .to(NutriClientService);

container
  .bind<INutritionistApplicationService>(TYPES.INutritionistApplicationService)
  .to(NutritionistApplicationService);

container
  .bind<INutritionistPlanService>(TYPES.INutritionistPlanService)
  .to(NutritionistPlanService);

// ---------- Repositories ----------

container
  .bind<INutriClientRepository>(TYPES.INutriClientRepository)
  .to(NutriClientRepository);
container
  .bind<INutriMeetingsRepository>(TYPES.INutriMeetingsRepository)
  .to(NutriMeetingsRepository);

container
  .bind<INutritionistPlanRepository>(TYPES.INutritionistPlanRepository)
  .to(NutritionistPlanRepository);

container
  .bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository)
  .to(NutritionistProfileRepository);

// latest
container
  .bind<INutriProgramRepository>(TYPES.INutriProgramRepository)
  .to(NutriProgramRepository);
container
  .bind<INutriProgramDayService>(TYPES.INutriProgramDayService)
  .to(NutriProgramDayService);

container
  .bind<INutriProgramDayController>(TYPES.INutriProgramDayController)
  .to(NutriProgramDayController);

container
  .bind<INutriProgramDayRepository>(TYPES.INutriProgramDayRepository)
  .to(NutriProgramDayRepository);

// ======================================================
// CHAT BINDINGS
// ======================================================

// ---------- Controllers ----------
container
  .bind<IConversationController>(TYPES.IConversationController)
  .to(ConversationController);

container
  .bind<IMessageController>(TYPES.IMessageController)
  .to(MessageController);

// ---------- Services ----------
container
  .bind<IConversationService>(TYPES.IConversationService)
  .to(ConversationService);

container.bind<IMessageService>(TYPES.IMessageService).to(MessageService);

// ---------- Repositories ----------
container
  .bind<IConversationMemberRepository>(TYPES.IConversationMemberRepository)
  .to(ConversationMemberRepository);

container
  .bind<IConversationRepository>(TYPES.IConversationRepository)
  .to(ConversationRepository);

container
  .bind<IMessageReceiptRepository>(TYPES.IMessageReceiptRepository)
  .to(MessageReceiptRepository);

container
  .bind<IMessageRepository>(TYPES.IMessageRepository)
  .to(MessageRepository);

// ======================================================
// COMMON BINDINGS
// ======================================================

// ---------- Controllers ----------
container
  .bind<ICheckoutController>(TYPES.ICheckoutController)
  .to(CheckoutController);

container
  .bind<IStripeWebhookController>(TYPES.IStripeWebhookController)
  .to(StripeWebhookController);

// ---------- Services ----------
container.bind<ICheckoutService>(TYPES.ICheckoutService).to(CheckoutService);

container
  .bind<INotificationService>(TYPES.INotificationService)
  .to(NotificationService);

container.bind<IOTPService>(TYPES.IOTPService).to(OtpService);

container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);

container
  .bind<IStripeWebhookService>(TYPES.IStripeWebhookService)
  .to(StripeWebhookService);
container
  .bind<IStripeCheckoutHandlerService>(TYPES.IStripeCheckoutHandlerService)
  .to(StripeCheckoutHandlerService);

// ---------- Repositories ----------
container
  .bind<INotificationRepository>(TYPES.INotificationRepository)
  .to(NotificationRepository);

container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);

container
  .bind<IPasswordResetRepository>(TYPES.IPasswordResetRepository)
  .to(PasswordResetRepository);

container
  .bind<IPaymentRepository>(TYPES.IPaymentRepository)
  .to(PaymentRepository);

container.bind<IWalletRepository>(TYPES.IWalletRepository).to(WalletRepository);

// ======================================================
// SOCKET BINDINGS
// ======================================================

container.bind<ISocketService>(TYPES.ISocketService).to(SocketService);

export { container };
