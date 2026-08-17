export const TYPES = {
  // ======================================================
  // COMMON
  // ======================================================

  // Controllers
  ICheckoutController: Symbol.for("ICheckoutController"),
  IStripeWebhookController: Symbol.for("IStripeWebhookController"),
  IConversationController: Symbol.for("IConversationController"),
  IMessageController: Symbol.for("IMessageController"),

  // Services
  IStripeService: Symbol.for("IStripeService"),
  ICheckoutService: Symbol.for("ICheckoutService"),
  IStripeWebhookService: Symbol.for("IStripeWebhookService"),
  ISocketService: Symbol.for("ISocketService"),
  IConversationService: Symbol.for("IConversationService"),
  IMessageService: Symbol.for("IMessageService"),
  IStripeCheckoutHandlerService: Symbol.for("IStripeCheckoutHandlerService"),

  // Repositories
  IWalletRepository: Symbol.for("IWalletRepository"),
  IPaymentRepository: Symbol.for("IPaymentRepository"),
  IConversationRepository: Symbol.for("IConversationRepository"),
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationMemberRepository: Symbol.for("IConversationMemberRepository"),
  IMessageReceiptRepository: Symbol.for("IMessageReceiptRepository"),
  INotificationRepository: Symbol.for("INotificationRepository"),

  // Shared Services
  INotificationService: Symbol.for("INotificationService"),
  IOTPService: Symbol.for("IOTPService"),

  // Shared Repositories
  IOtpRepository: Symbol.for("IOtpRepository"),
  IPasswordResetRepository: Symbol.for("IPasswordResetRepository"),

  // ======================================================
  // USER MODULE
  // ======================================================

  // Controllers
  IUserProgramBrowseRepository: Symbol.for("IUserProgramBrowseRepository"),
  IUserAuthController: Symbol.for("IUserAuthController"),
  IUserProfileController: Symbol.for("IUserProfileController"),
  IHealthDetailsController: Symbol.for("IHealthDetailsController"),
  IUserPlanController: Symbol.for("IUserPlanController"),
  IUserAccountController: Symbol.for("IUserAccountController"),
  IUserMeetingsController: Symbol.for("IUserMeetingsController"),
  IUserProgramController: Symbol.for("IUserProgramController"),
  ITaskController: Symbol.for("ITaskController"),
  IHealthProgressController: Symbol.for("IHealthProgressController"),
  IReviewController: Symbol.for("IReviewController"),
  IUserGroupController: Symbol.for("IUserGroupController"),
  IOnboardingController: Symbol.for("IOnboardingController"),
  INutritionistBrowsingController: Symbol.for(
    "INutritionistBrowsingController",
  ),
  INutritionistPlanBrowsingController: Symbol.for(
    "INutritionistPlanBrowsingController",
  ),
  IUserProgramDayController: Symbol.for("IUserProgramDayController"),
  IUserActivityTrackingController:Symbol.for("IUserActivityTrackingController"),

  // Services
  IUserAuthService: Symbol.for("IUserAuthService"),
  IUserProfileService: Symbol.for("IUserProfileService"),
  IHealthDetailsService: Symbol.for("IHealthDetailsService"),
  IUserPlanService: Symbol.for("IUserPlanService"),
  IUserAccountService: Symbol.for("IUserAccountService"),
  IUserMeetingsService: Symbol.for("IUserMeetingsService"),
  IUserProgramService: Symbol.for("IUserProgramService"),
  ITaskService: Symbol.for("ITaskService"),
  IHealthProgressService: Symbol.for("IHealthProgressService"),
  IReviewService: Symbol.for("IReviewService"),
  IUserGroupService: Symbol.for("IUserGroupService"),
  IOnboardingService: Symbol.for("IOnboardingService"),
  INutritionistBrowsingService: Symbol.for("INutritionistBrowsingService"),
  INutritionistPlanBrowsingService: Symbol.for(
    "INutritionistPlanBrowsingService",
  ),
  IUserProgramDayService: Symbol.for("IUserProgramDayService"),
  IUserDayTrackingService:Symbol.for("IUserDayTrackingService"),
  IUserActivityTrackingService:Symbol.for("IUserActivityTrackingService"),

  // Repositories
  IUserRepository: Symbol.for("IUserRepository"),
  IHealthDetailsRepository: Symbol.for("IHealthDetailsRepository"),
  IUserPlanRepository: Symbol.for("IUserPlanRepository"),
  IUserProgramRepository: Symbol.for("IUserProgramRepository"),
  IUserProgramDayRepository: Symbol.for("IUserProgramDayRepository"),
  ITaskLogRepository: Symbol.for("ITaskLogRepository"),
  IHealthProgressRepository: Symbol.for("IHealthProgressRepository"),
  IReviewRepository: Symbol.for("IReviewRepository"),
  INutritionistBrowsingRepository: Symbol.for(
    "INutritionistBrowsingRepository",
  ),
  INutritionistPlanBrowsingRepository: Symbol.for(
    "INutritionistPlanBrowsingRepository",
  ),
  IUserProgramProgressRepository: Symbol.for("IUserProgramProgressRepository"),
  IUserDayTrackingRepository:Symbol.for("IUserDayTrackingRepository"),
  IUserActivityTrackingRepository:Symbol.for("IUserActivityTrackingRepository"),

  // ======================================================
  // ADMIN MODULE
  // ======================================================

  // Controllers
  IAdminUserController: Symbol.for("IAdminUserController"),
  IAdminNutritionistController: Symbol.for("IAdminNutritionistController"),
  IAdminNutritionistApplicationController: Symbol.for(
    "IAdminNutritionistApplicationController",
  ),
  IAdminNotificationController: Symbol.for("IAdminNotificationController"),
  IAdminPlanController: Symbol.for("IAdminPlanController"),

  // Services
  IAdminUserService: Symbol.for("IAdminUserService"),
  IAdminNutritionistService: Symbol.for("IAdminNutritionistService"),
  IAdminNutritionistApplicationService: Symbol.for(
    "IAdminNutritionistApplicationService",
  ),
  IAdminPlanService: Symbol.for("IAdminPlanService"),

  // Repositories
  IAdminUserRepository: Symbol.for("IAdminUserRepository"),
  IAdminNutritionistRepository: Symbol.for("IAdminNutritionistRepository"),
  IAdminNutritionistApplicationRepository: Symbol.for(
    "IAdminNutritionistApplicationRepository",
  ),

  // ======================================================
  // NUTRITIONIST MODULE
  // ======================================================

  // Controllers
  INutritionistApplicationController: Symbol.for(
    "INutritionistApplicationController",
  ),
  INutritionistPlanController: Symbol.for("INutritionistPlanController"),
  INutriProgramController: Symbol.for("INutriProgramController"),
  INutriMeetingsController: Symbol.for("INutriMeetingsController"),
  INutriGroupController: Symbol.for("INutriCommunityController"),
  INutriClientController: Symbol.for("INutriClientController"),
  INutriProgramDayController: Symbol.for("INutriProgramDayController"),

  // Services
  INutritionistApplicationService: Symbol.for(
    "INutritionistApplicationService",
  ),
  INutritionistPlanService: Symbol.for("INutritionistPlanService"),
  INutriProgramService: Symbol.for("INutriProgramService"),
  INutriMeetingsService: Symbol.for("INutriMeetingsService"),
  INutriGroupService: Symbol.for("INutriCommunityService"),
  INutriClientService: Symbol.for("INutriClientService"),
  INutriProgramDayService: Symbol.for("INutriProgramDayService"),

  // Repositories
  INutritionistAuthRepository: Symbol.for("INutritionistAuthRepository"),
  INutritionistDetailsRepository: Symbol.for("INutritionistDetailsRepository"),
  INutritionistProfileRepository: Symbol.for("INutritionistProfileRepository"),
  INutritionistPlanRepository: Symbol.for("INutritionistPlanRepository"),
  INutriMeetingsRepository: Symbol.for("INutriMeetingsRepository"),
  INutriClientRepository: Symbol.for("INutriClientRepository"),
  INutriProgramRepository: Symbol.for("INutriProgramRepository"),
  INutriProgramDayRepository: Symbol.for("INutriProgramDayRepository"),
};
