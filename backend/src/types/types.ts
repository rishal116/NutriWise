export const TYPES = {
  //User
  IPasswordResetRepository: Symbol.for("IPasswordResetRepository"),
  IUserAuthController: Symbol.for("IUserAuthController"),
  IUserAuthService: Symbol.for("IUserAuthService"),
  IUserRepository: Symbol.for("IUserRepository"),
  IOTPService: Symbol.for("IOTPService"),
  IOtpRepository: Symbol.for("IOtpRepository"),
  INutritionistController: Symbol.for("INutritionistController"),
  INutritionistService: Symbol.for("INutritionistService"),
  IUserNutritionistProfileRepository: Symbol.for(
    "IUserNutritionistProfileRepository",
  ),
  IUserProfileController: Symbol.for("IUserProfileController"),
  IUserProfileService: Symbol.for("IUserProfileService"),
  ICheckoutService: Symbol.for("ICheckoutService"),
  IHealthDetailsService: Symbol.for("IHealthDetailsService"),
  IHealthDetailsRepository: Symbol.for("IHealthDetailsRepository"),
  IHealthDetailsController: Symbol.for("IHealthDetailsController"),
  IUserPlanRepository: Symbol.for("IUserPlanRepository"),
  IUserPlanService: Symbol.for("IUserPlanService"),
  IUserPlanController: Symbol.for("IUserPlanController"),
  IUserAccountService: Symbol.for("IUserAccountService"),
  IUserAccountController: Symbol.for("IUserAccountController"),

  IUserMeetingsController: Symbol.for("IUserMeetingsController"),
  IUserMeetingsService: Symbol.for("IUserMeetingsService"),
  IUserProgramRepository: Symbol.for("IUserProgramRepository"),
  IProgramDayRepository: Symbol.for("IProgramDayRepository"),
  IUserProgramService: Symbol.for("IUserProgramService"),
  IUserProgramController: Symbol.for("IUserProgramController"),
  ITaskService: Symbol.for("ITaskService"),
  ITaskLogRepository: Symbol.for("ITaskLogRepository"),
  ITaskController: Symbol.for("ITaskController"),
  IHealthProgressRepository: Symbol.for("IHealthProgressRepository"),
  IHealthProgressController: Symbol.for("IHealthProgressController"),
  IHealthProgressService: Symbol.for("IHealthProgressService"),
  IReviewService: Symbol.for("IReviewService"),
  IReviewRepository: Symbol.for("IReviewRepository"),
  IReviewController: Symbol.for("IReviewController"),
  IUserGroupController: Symbol.for("IUserGroupController"),
  IUserGroupService: Symbol.for("IUserGroupService"),

  IOnboardingService: Symbol.for("IOnboardingService"),
  IOnboardingController: Symbol.for("IOnboardingController"),

  //Admin
  IAdminUserController: Symbol.for("IAdminUserController"),
  IAdminUserService: Symbol.for("IAdminUserService"),
  IAdminUserRepository: Symbol.for("IAdminUserRepository"),

  IAdminNutritionistController: Symbol.for("IAdminNutritionistController"),
  IAdminNutritionistService: Symbol.for("IAdminNutritionistService"),
  IAdminNutritionistRepository: Symbol.for("IAdminNutritionistRepository"),

  IAdminNutritionistApplicationController: Symbol.for(
    "IAdminNutritionistApplicationController",
  ),
  IAdminNutritionistApplicationService: Symbol.for(
    "IAdminNutritionistApplicationService",
  ),
  IAdminNutritionistApplicationRepository: Symbol.for(
    "IAdminNutritionistApplicationRepository",
  ),

  IAdminNotificationController: Symbol.for("IAdminNotificationController"),
  INotificationRepository: Symbol.for("INotificationRepository"),
  INotificationService: Symbol.for("INotificationService"),
  IAdminPlanService: Symbol.for("IAdminPlanService"),
  IAdminPlanController: Symbol.for("IAdminPlanController"),

  //Nutritionist
  INutritionistApplicationController: Symbol.for(
    "INutritionistApplicationController",
  ),
  INutritionistApplicationService: Symbol.for(
    "INutritionistApplicationService",
  ),
  INutritionistAuthRepository: Symbol.for("INutritionistAuthRepository"),
  INutritionistDetailsRepository: Symbol.for("INutritionistDetailsRepository"),
  INutritionistProfileRepository: Symbol.for("INutritionistProfileRepository"),
  INutritionistPlanController: Symbol.for("INutritionistPlanController"),
  INutritionistPlanService: Symbol.for("INutritionistPlanService"),
  INutritionistPlanRepository: Symbol.for("INutritionistPlanRepository"),
  INutritionistSubscriptionController: Symbol.for(
    "INutritionistSubscriptionController",
  ),
  INutriProgramService: Symbol.for("INutriProgramService"),
  INutriProgramController: Symbol.for("INutriProgramController"),
  INutriSubscriptionService: Symbol.for("INutriSubscriptionService"),
  INutriGroupService: Symbol.for("INutriCommunityService"),

  // meetings
  INutriMeetingsController: Symbol.for("INutriMeetingsController"),
  INutriMeetingsService: Symbol.for("INutriMeetingsService"),
  INutriMeetingsRepository: Symbol.for("INutriMeetingsRepository"),

  INutriGroupController: Symbol.for("INutriCommunityController"),

  // common
  IStripeService: Symbol.for("IStripeService"),
  ICheckoutController: Symbol.for("ICheckoutController"),
  IStripeWebhookService: Symbol.for("IStripeWebhookService"),
  IStripeWebhookController: Symbol.for("IStripeWebhookController"),
  IWalletRepository: Symbol.for("IWalletRepository"),
  IPaymentRepository: Symbol.for("IPaymentRepository"),

  // community

  // chat
  IConversationController: Symbol.for("IConversationController"),
  IMessageController: Symbol.for("IMessageController"),
  IConversationService: Symbol.for("IConversationService"),
  IMessageService: Symbol.for("MessageService"),
  IConversationRepository: Symbol.for("IConversationRepository"),
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationMemberRepository: Symbol.for("IConversationMemberRepository"),
  IMessageReceiptRepository: Symbol.for("IMessageReceiptRepository"),

  // socket
  ISocketService: Symbol.for("ISocketService"),
};
