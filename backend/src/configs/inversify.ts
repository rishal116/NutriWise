import "reflect-metadata";
import { Container } from "inversify";

// USER MODULE

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
import { UserMeetingController } from "../controllers/implementations/user/userMeeting.controller";
import { UserProfileController } from "../controllers/implementations/user/userProfile.controller";
import { UserProgramController } from "../controllers/implementations/user/userProgram.controller";
import { UserProgramDayController } from "../controllers/implementations/user/userProgramDay.controller";
import { UserActivityTrackingController } from "../controllers/implementations/user/userActivityTracking.controller";

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
import { UserMeetingService } from "../services/implements/user/meeting/userMeeting.service";
import { UserProfileService } from "../services/implements/user/userProfile.service";
import { UserProgramService } from "../services/implements/user/program/userProgram.service";
import { UserProgramDayService } from "../services/implements/user/program/userProgramDay.service";
import { UserDayTrackingService } from "../services/implements/user/tracking/userDayTracking.service";
import { UserActivityTrackingService } from "../services/implements/user/tracking/userActivityTracking.service";

// ---------- Repositories ----------

import { HealthDetailsRepository } from "../repositories/implements/user/account/healthDetails.repository";
import { HealthProgressRepository } from "../repositories/implements/user/account/healthProgress.repository";
import { UserRepository } from "../repositories/implements/user/account/user.repository";

import { NutritionistBrowsingRepository } from "../repositories/implements/user/discovery/nutriBrowsing.repository";
import { NutritionistPlanBrowsingRepository } from "../repositories/implements/user/discovery/nutriPlanBrowsing.repository";
import { ReviewRepository } from "../repositories/implements/user/discovery/review.repository";

import { UserPlanRepository } from "../repositories/implements/user/program/userPlan.repository";
import { UserProgramRepository } from "../repositories/implements/user/program/userProgram.repository";
import { UserProgramBrowseRepository } from "../repositories/implements/user/program/userProgramBrowse.repository";
import { UserProgramDayRepository } from "../repositories/implements/user/program/userProgramDay.repository";

import { UserProgramProgressRepository } from "../repositories/implements/user/tracking/userProgramProgress.repository";
import { UserDayTrackingRepository } from "../repositories/implements/user/tracking/userDayTracking.repository";
import { UserActivityTrackingRepository } from "../repositories/implements/user/tracking/userActivityTracking.repository";

import { UserMeetingRepository } from "../repositories/implements/user/meeting/userMeeting.repository";

// ---------- Interfaces ----------

// Controllers

import { IHealthDetailsController } from "../controllers/interfaces/user/IHealthDetailsController";
import { IHealthProgressController } from "../controllers/interfaces/user/IHealthProgressController";
import { INutritionistBrowsingController } from "../controllers/interfaces/user/INutriBrowsingController";
import { INutritionistPlanBrowsingController } from "../controllers/interfaces/user/INutritionistPlanBrowsingController";
import { IOnboardingController } from "../controllers/interfaces/user/IOnboardingController";
import { IReviewController } from "../controllers/interfaces/user/IReviewController";
import { IUserAccountController } from "../controllers/interfaces/user/IUserAccountController";
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { IUserGroupController } from "../controllers/interfaces/user/IUserGroupController";
import { IUserMeetingController } from "../controllers/interfaces/user/IUserMeetingController";
import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { IUserProgramController } from "../controllers/interfaces/user/IUserProgramController";
import { IUserProgramDayController } from "../controllers/interfaces/user/IUserProgramDayController";
import { IUserActivityTrackingController } from "../controllers/interfaces/user/IUserActivityTrackingController";

// Services

import { IHealthDetailsService } from "../services/interfaces/user/account/IHealthDetailsService";
import { IHealthProgressService } from "../services/interfaces/user/account/IHealthProgress.Service";

import { INutritionistBrowsingService } from "../services/interfaces/user/discovery/INutriBrowsingService";
import { INutritionistPlanBrowsingService } from "../services/interfaces/user/discovery/INutritionistPlanBrowsingService";
import { IReviewService } from "../services/interfaces/user/IReviewService";

import { IOnboardingService } from "../services/interfaces/user/IOnboardingService";
import { IUserAccountService } from "../services/interfaces/user/IUserAccountService";
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { IUserGroupService } from "../services/interfaces/user/IUserGroupService";
import { IUserMeetingService } from "../services/interfaces/user/IUserMeetingService";
import { IUserProfileService } from "../services/interfaces/user/IUserProfileService";

import { IUserProgramService } from "../services/interfaces/user/program/IUserProgramService";
import { IUserProgramDayService } from "../services/interfaces/user/program/IUserProgramDayService";

import { IUserDayTrackingService } from "../services/interfaces/user/tracking/IUserDayTrackingService";
import { IUserActivityTrackingService } from "../services/interfaces/user/tracking/IUserActivityTrackingService";

// Repositories

import { IHealthDetailsRepository } from "../repositories/interfaces/user/account/IHealthDetailsRepository";
import { IHealthProgressRepository } from "../repositories/interfaces/user/account/IHealthProgressRepository";
import { IUserRepository } from "../repositories/interfaces/user/account/IUserRepository";

import { INutritionistBrowsingRepository } from "../repositories/interfaces/user/discovery/INutriBrowsingRepository";
import { INutritionistPlanBrowsingRepository } from "../repositories/interfaces/user/discovery/INutriPlanBrowsingRepository";
import { IReviewRepository } from "../repositories/interfaces/user/discovery/IReviewRepository";

import { IUserPlanRepository } from "../repositories/interfaces/user/program/IUserPlanRepository";
import { IUserProgramRepository } from "../repositories/interfaces/user/program/IUserProgramRepository";
import { IUserProgramBrowseRepository } from "../repositories/interfaces/user/program/IUserProgramBrowseRepository";
import { IUserProgramDayRepository } from "../repositories/interfaces/user/program/IUserProgramDayRepository";

import { IUserProgramProgressRepository } from "../repositories/interfaces/user/tracking/IUserProgramProgressRepository";
import { IUserDayTrackingRepository } from "../repositories/interfaces/user/tracking/IUserDayTrackingRepository";
import { IUserActivityTrackingRepository } from "../repositories/interfaces/user/tracking/IUserActivityTrackingRepository";

import { IUserMeetingRepository } from "../repositories/interfaces/user/meeting/IUserMeetingRepository";

// PUBLIC MODULE

// ---------- Controllers ----------

import { PublicResourceController } from "../controllers/implementations/public/publicResource.controller";
import { PublicSessionController } from "../controllers/implementations/public/publicSession.controller";
import { SessionCheckoutController } from "../controllers/implementations/public/sessionCheckout.controller";
import { SessionRegistrationController } from "../controllers/implementations/public/sessionRegistration.controller";

// ---------- Services ----------

import { PublicResourceService } from "../services/implements/public/publicResource.service";
import { PublicSessionService } from "../services/implements/public/publicSession.service";
import { SessionCheckoutService } from "../services/implements/public/sessionCheckout.service";
import { SessionRegistrationService } from "../services/implements/public/sessionRegistration.service";

// ---------- Repositories ----------

import { ResourceRepository } from "../repositories/implements/public/resource.repository";
import { SessionRepository } from "../repositories/implements/public/session.repository";
import { SessionRegistrationRepository } from "../repositories/implements/public/sessionRegistration.repository";

// ---------- Interfaces ----------

// Controllers

import { IPublicResourceController } from "../controllers/interfaces/public/IPublicResourceController";
import { IPublicSessionController } from "../controllers/interfaces/public/IPublicSessionController";
// Services

import { IPublicResourceService } from "../services/interfaces/public/IPublicResourceService";
import { IPublicSessionService } from "../services/interfaces/public/IPublicSessionService";

// Repositories

import { IResourceRepository } from "../repositories/interfaces/public/IResourceRepository";
import { ISessionRepository } from "../repositories/interfaces/public/ISessionRepository";

// ADMIN MODULE

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

// Controllers

import { IAdminNutritionistApplicationController } from "../controllers/interfaces/admin/IAdminNutritionistApplicationController";
import { IAdminNutritionistController } from "../controllers/interfaces/admin/IAdminNutritionistController";
import { IAdminUserController } from "../controllers/interfaces/admin/IAdminUserController";

// Services

import { IAdminNutritionistApplicationService } from "../services/interfaces/admin/IAdminNutritionistApplicationService";
import { IAdminNutritionistService } from "../services/interfaces/admin/IAdminNutritionistService";
import { IAdminUserService } from "../services/interfaces/admin/IAdminUserService";

// Repositories

import { IAdminNutritionistApplicationRepository } from "../repositories/interfaces/admin/IAdminNutritionistApplicationRepository";
import { IAdminNutritionistRepository } from "../repositories/interfaces/admin/IAdminNutritionistRepository";
import { IAdminUserRepository } from "../repositories/interfaces/admin/IAdminUserRepository";

// NUTRITIONIST MODULE

// ---------- Controllers ----------

import { NutriGroupController } from "../controllers/implementations/nutritionist/nutriGroup.controller";
import { NutriMeetingController } from "../controllers/implementations/nutritionist/nutriMeeting.controller";
import { NutriProgramController } from "../controllers/implementations/nutritionist/nutriProgram.controller";
import { NutritionistApplicationController } from "../controllers/implementations/nutritionist/nutriApplication.controller";
import { NutritionistPlanController } from "../controllers/implementations/nutritionist/nutriPlan.controller";
import { NutriClientController } from "../controllers/implementations/nutritionist/nutriClient.controller";
import { NutriProgramDayController } from "../controllers/implementations/nutritionist/nutriProgramDay.controller";
import { NutriResourceController } from "../controllers/implementations/nutritionist/nutriResource.controller";
import { NutriSessionController } from "../controllers/implementations/nutritionist/nuriSession.controller";

// ---------- Services ----------

import { NutriGroupService } from "../services/implements/nutritionist/nutriGroup.service";
import { NutriMeetingService } from "../services/implements/nutritionist/nutriMeeting.service";
import { NutriProgramService } from "../services/implements/nutritionist/nutriProgram.service";
import { NutriProgramDayService } from "../services/implements/nutritionist/nutriProgramDay.service";
import { NutriClientService } from "../services/implements/nutritionist/nutriClient.service";
import { NutritionistApplicationService } from "../services/implements/nutritionist/nutriApplication.service";
import { NutritionistPlanService } from "../services/implements/nutritionist/nutriPlan.service";
import { NutriResourceService } from "../services/implements/nutritionist/nutriResource.service";
import { NutriSessionService } from "../services/implements/nutritionist/nutriSession.service";

// ---------- Repositories ----------

import { NutriClientRepository } from "../repositories/implements/nutritionist/nutriClient.repository";
import { NutriMeetingRepository } from "../repositories/implements/nutritionist/nutriMeeting.repository";
import { NutritionistPlanRepository } from "../repositories/implements/nutritionist/nutriPlan.repository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutriProfile.repository";
import { NutriProgramRepository } from "../repositories/implements/nutritionist/nutriProgram.repository";
import { NutriProgramDayRepository } from "../repositories/implements/nutritionist/nutriProgramDay.repository";
import { NutriResourceRepository } from "../repositories/implements/nutritionist/nutriResource.repository";
import { NutriSessionRepository } from "../repositories/implements/nutritionist/nutriSession.repository";

// ---------- Interfaces ----------

// Controllers

import { INutriGroupController } from "../controllers/interfaces/nutritionist/INutriGroupController";
import { INutriMeetingController } from "../controllers/interfaces/nutritionist/INutriMeetingController";
import { INutriProgramController } from "../controllers/interfaces/nutritionist/INutriProgramController";
import { INutritionistApplicationController } from "../controllers/interfaces/nutritionist/INutriApplicationController";
import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutriPlanController";
import { INutriClientController } from "../controllers/interfaces/nutritionist/INutriClientController";
import { INutriProgramDayController } from "../controllers/interfaces/nutritionist/INutriProgramDayController";
import { INutriResourceController } from "../controllers/interfaces/nutritionist/INutriResourceController";
import { INutriSessionController } from "../controllers/interfaces/nutritionist/INutriSessionController";

// Services

import { INutriGroupService } from "../services/interfaces/nutritionist/INutriGroupService";
import { INutriMeetingService } from "../services/interfaces/nutritionist/INutriMeetingService";
import { INutriProgramService } from "../services/interfaces/nutritionist/INutriProgramService";
import { INutriProgramDayService } from "../services/interfaces/nutritionist/INutriProgramDayService";
import { INutriClientService } from "../services/interfaces/nutritionist/INutriClientService";
import { INutritionistApplicationService } from "../services/interfaces/nutritionist/INutriApplicationService";
import { INutritionistPlanService } from "../services/interfaces/nutritionist/INutriPlanService";
import { INutriResourceService } from "../services/interfaces/nutritionist/INutriResourceService";
import { INutriSessionService } from "../services/interfaces/nutritionist/INutriSessionService";

// Repositories

import { INutriClientRepository } from "../repositories/interfaces/nutritionist/INutriClientRepository";
import { INutriMeetingRepository } from "../repositories/interfaces/nutritionist/INutriMeetingRepository";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutriPlanRepository";
import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutriProfileRepository";
import { INutriProgramRepository } from "../repositories/interfaces/nutritionist/INutriProgramRepository";
import { INutriProgramDayRepository } from "../repositories/interfaces/nutritionist/INutriProgramDayRepository";
import { INutriResourceRepository } from "../repositories/interfaces/nutritionist/INutriResourceRepository";
import { INutriSessionRepository } from "../repositories/interfaces/nutritionist/INutriSessionRepository";

// CHAT MODULE

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

// Controllers

import { IConversationController } from "../controllers/interfaces/chat/IConversationController";
import { IMessageController } from "../controllers/interfaces/chat/IMessageController";

// Services

import { IConversationService } from "../services/interfaces/chat/IConversationService";
import { IMessageService } from "../services/interfaces/chat/IMessageService";

// Repositories

import { IConversationMemberRepository } from "../repositories/interfaces/chat/IConversationMemberRepository";
import { IConversationRepository } from "../repositories/interfaces/chat/IConversationRepository";
import { IMessageReceiptRepository } from "../repositories/interfaces/chat/IMessageReceiptRepository";
import { IMessageRepository } from "../repositories/interfaces/chat/IMessageRepository";

// ======================================================
// COMMON MODULE
// ======================================================

// ---------- Controllers ----------

import { CheckoutController } from "../controllers/implementations/user/checkout.controller";
import { StripeWebhookController } from "../controllers/implementations/common/stripeWebhook.controller";

// ---------- Services ----------

import { CheckoutService } from "../services/implements/user/checkout.service";
import { NotificationService } from "../services/implements/common/notification.service";
import { OtpService } from "../services/implements/common/otp.service";
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

// Controllers

import { ICheckoutController } from "../controllers/interfaces/user/ICheckoutController";
import { IStripeWebhookController } from "../controllers/interfaces/common/IStripeWebhookController";

// Services

import { ICheckoutService } from "../services/interfaces/user/ICheckoutService";
import { INotificationService } from "../services/interfaces/common/INotificationService";
import { IOTPService } from "../services/interfaces/common/IOtpService";
import { IStripeService } from "../services/interfaces/common/stripe/IStripeService";
import { IStripeWebhookService } from "../services/interfaces/common/stripe/IStripeWebhookService";
import { IStripeCheckoutHandlerService } from "../services/interfaces/common/stripe/IStripeCheckoutHandlerService";

// Repositories

import { INotificationRepository } from "../repositories/interfaces/common/INotificationRepository";
import { IOtpRepository } from "../repositories/interfaces/common/IOtpRepository";
import { IPasswordResetRepository } from "../repositories/interfaces/common/IPasswordResetRepository";
import { IPaymentRepository } from "../repositories/interfaces/common/IPaymentRepository";
import { IWalletRepository } from "../repositories/interfaces/common/IWalletRepository";

// SOCKET MODULE

import { ISocketService } from "../services/interfaces/socket/ISocketService";
import { SocketService } from "../services/implements/socket/socket.service";

import { TYPES } from "../types/types";
import { ISessionCheckoutController } from "../controllers/interfaces/public/ISessionCheckoutController";
import { ISessionRegistrationController } from "../controllers/interfaces/public/ISessionRegistrationController";
import { ISessionCheckoutService } from "../services/interfaces/public/ISessionCheckoutService";
import { ISessionRegistrationService } from "../services/interfaces/public/ISessionRegistrationService";
import { ISessionRegistrationRepository } from "../repositories/interfaces/public/ISessionRegistrationRepository";
import { ISessionRoomController } from "../controllers/interfaces/public/ISessionRoomController";
import { SessionRoomController } from "../controllers/implementations/public/sessionRoom.controller";
import { ISessionRoomService } from "../services/interfaces/public/ISessionRoomService";
import { SessionRoomService } from "../services/implements/public/sessionRoom.service";
import { ILiveKitService } from "../services/interfaces/livekit/ILiveKitService";
import { LiveKitService } from "../services/implements/livekit/livekit.service";
import { IResourceViewRepository } from "../repositories/interfaces/public/IResourceViewRepository";
import { ResourceViewRepository } from "../repositories/implements/public/resourceView.repository";
import { IResourceBookmarkRepository } from "../repositories/interfaces/public/IResourceBookmarkRepository";
import { ResourceBookmarkRepository } from "../repositories/implements/public/resourcBookmark.repository";
import { IResourceLikeRepository } from "../repositories/interfaces/public/IResourceLikeRepository";
import { ResourceLikeRepository } from "../repositories/implements/public/resourcLike.repository";
import { IResourceCommentRepository } from "../repositories/interfaces/public/IResourceCommentRepository";
import { ResourceCommentRepository } from "../repositories/implements/public/resourcComment.repository";
import { IUserPostRepository } from "../repositories/interfaces/user/post/IUserPostRepository";
import { UserPostRepository } from "../repositories/implements/user/post/userPost.repository";
import { IUserPostService } from "../services/interfaces/user/IUserPostSservice";
import { UserPostService } from "../services/implements/user/userPost.service";
import { IUserPostController } from "../controllers/interfaces/user/IUserPostController";
import { UserPostController } from "../controllers/implementations/user/userPost.controller";

const container = new Container();

// USER BINDINGS

// ---------- Controllers ----------

container
  .bind<IUserProgramController>(TYPES.IUserProgramController)
  .to(UserProgramController);

container
  .bind<IUserProgramDayController>(TYPES.IUserProgramDayController)
  .to(UserProgramDayController);

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
  .bind<IUserProfileController>(TYPES.IUserProfileController)
  .to(UserProfileController);

container
  .bind<IUserActivityTrackingController>(TYPES.IUserActivityTrackingController)
  .to(UserActivityTrackingController);

container
  .bind<IUserMeetingController>(TYPES.IUserMeetingController)
  .to(UserMeetingController);

container
  .bind<IUserPostController>(TYPES.IUserPostController)
  .to(UserPostController);

// ---------- Services ----------

container
  .bind<IUserProgramService>(TYPES.IUserProgramService)
  .to(UserProgramService);

container
  .bind<IUserProgramDayService>(TYPES.IUserProgramDayService)
  .to(UserProgramDayService);

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
  .bind<IUserMeetingService>(TYPES.IUserMeetingService)
  .to(UserMeetingService);

container
  .bind<IUserProfileService>(TYPES.IUserProfileService)
  .to(UserProfileService);

container
  .bind<IUserDayTrackingService>(TYPES.IUserDayTrackingService)
  .to(UserDayTrackingService);

container
  .bind<IUserActivityTrackingService>(TYPES.IUserActivityTrackingService)
  .to(UserActivityTrackingService);

container.bind<IUserPostService>(TYPES.IUserPostService).to(UserPostService);

// ---------- Repositories ----------

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
  .bind<IUserPlanRepository>(TYPES.IUserPlanRepository)
  .to(UserPlanRepository);

container
  .bind<IUserDayTrackingRepository>(TYPES.IUserDayTrackingRepository)
  .to(UserDayTrackingRepository);

container
  .bind<IUserActivityTrackingRepository>(TYPES.IUserActivityTrackingRepository)
  .to(UserActivityTrackingRepository);

container
  .bind<IUserMeetingRepository>(TYPES.IUserMeetingRepository)
  .to(UserMeetingRepository);

container
  .bind<IUserPostRepository>(TYPES.IUserPostRepository)
  .to(UserPostRepository);

// PUBLIC BINDINGS

// ---------- Controllers ----------

container
  .bind<IPublicResourceController>(TYPES.IPublicResourceController)
  .to(PublicResourceController);

container
  .bind<IPublicSessionController>(TYPES.IPublicSessionController)
  .to(PublicSessionController);

container
  .bind<ISessionCheckoutController>(TYPES.ISessionCheckoutController)
  .to(SessionCheckoutController);
container
  .bind<ISessionRegistrationController>(TYPES.ISessionRegistrationController)
  .to(SessionRegistrationController);

container
  .bind<ISessionRoomController>(TYPES.ISessionRoomController)
  .to(SessionRoomController);

// ---------- Services ----------

container
  .bind<IPublicResourceService>(TYPES.IPublicResourceService)
  .to(PublicResourceService);

container
  .bind<IPublicSessionService>(TYPES.IPublicSessionService)
  .to(PublicSessionService);

container
  .bind<ISessionCheckoutService>(TYPES.ISessionCheckoutService)
  .to(SessionCheckoutService);
container
  .bind<ISessionRegistrationService>(TYPES.ISessionRegistrationService)
  .to(SessionRegistrationService);

container
  .bind<ISessionRoomService>(TYPES.ISessionRoomService)
  .to(SessionRoomService);

container.bind<ILiveKitService>(TYPES.ILiveKitService).to(LiveKitService);

// ---------- Repositories ----------

container
  .bind<IResourceRepository>(TYPES.IResourceRepository)
  .to(ResourceRepository);

container
  .bind<ISessionRepository>(TYPES.ISessionRepository)
  .to(SessionRepository);

container
  .bind<ISessionRegistrationRepository>(TYPES.ISessionRegistrationRepository)
  .to(SessionRegistrationRepository);

container
  .bind<IResourceViewRepository>(TYPES.IResourceViewRepository)
  .to(ResourceViewRepository);

container
  .bind<IResourceBookmarkRepository>(TYPES.IResourceBookmarkRepository)
  .to(ResourceBookmarkRepository);

container
  .bind<IResourceLikeRepository>(TYPES.IResourceLikeRepository)
  .to(ResourceLikeRepository);
container
  .bind<IResourceCommentRepository>(TYPES.IResourceCommentRepository)
  .to(ResourceCommentRepository);

// ADMIN BINDINGS

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

// NUTRITIONIST BINDINGS

// ---------- Controllers ----------

container
  .bind<INutriGroupController>(TYPES.INutriGroupController)
  .to(NutriGroupController);

container
  .bind<INutriMeetingController>(TYPES.INutriMeetingController)
  .to(NutriMeetingController);

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

container
  .bind<INutriResourceController>(TYPES.INutriResourceController)
  .to(NutriResourceController);

container
  .bind<INutriSessionController>(TYPES.INutriSessionController)
  .to(NutriSessionController);

container
  .bind<INutriProgramDayController>(TYPES.INutriProgramDayController)
  .to(NutriProgramDayController);

// ---------- Services ----------

container
  .bind<INutriGroupService>(TYPES.INutriGroupService)
  .to(NutriGroupService);

container
  .bind<INutriMeetingService>(TYPES.INutriMeetingService)
  .to(NutriMeetingService);

container
  .bind<INutriProgramService>(TYPES.INutriProgramService)
  .to(NutriProgramService);

container
  .bind<INutriProgramDayService>(TYPES.INutriProgramDayService)
  .to(NutriProgramDayService);

container
  .bind<INutriClientService>(TYPES.INutriClientService)
  .to(NutriClientService);

container
  .bind<INutritionistApplicationService>(TYPES.INutritionistApplicationService)
  .to(NutritionistApplicationService);

container
  .bind<INutritionistPlanService>(TYPES.INutritionistPlanService)
  .to(NutritionistPlanService);

container
  .bind<INutriResourceService>(TYPES.INutriResourceService)
  .to(NutriResourceService);

container
  .bind<INutriSessionService>(TYPES.INutriSessionService)
  .to(NutriSessionService);

// ---------- Repositories ----------

container
  .bind<INutriClientRepository>(TYPES.INutriClientRepository)
  .to(NutriClientRepository);

container
  .bind<INutriMeetingRepository>(TYPES.INutriMeetingRepository)
  .to(NutriMeetingRepository);

container
  .bind<INutritionistPlanRepository>(TYPES.INutritionistPlanRepository)
  .to(NutritionistPlanRepository);

container
  .bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository)
  .to(NutritionistProfileRepository);

container
  .bind<INutriProgramRepository>(TYPES.INutriProgramRepository)
  .to(NutriProgramRepository);

container
  .bind<INutriProgramDayRepository>(TYPES.INutriProgramDayRepository)
  .to(NutriProgramDayRepository);

container
  .bind<INutriResourceRepository>(TYPES.INutriResourceRepository)
  .to(NutriResourceRepository);

container
  .bind<INutriSessionRepository>(TYPES.INutriSessionRepository)
  .to(NutriSessionRepository);

// CHAT BINDINGS

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

// COMMON BINDINGS

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

// SOCKET BINDINGS

container.bind<ISocketService>(TYPES.ISocketService).to(SocketService);

export { container };
