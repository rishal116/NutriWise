export const TYPES = {
  //User
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
 
  IClientProfileService: Symbol.for("IClientProfileService"),
  IClientProfileRepository: Symbol.for("IClientProfileRepository"),
  IClientProfileController: Symbol.for("IClientProfileController"),
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
  IUserSessionService: Symbol.for("IUserSessionService"),
  IUserSessionController: Symbol.for("IUserSessionController"),

  //Admin
  IAdminAuthController: Symbol.for("IAdminAuthController"),
  IAdminAuthService: Symbol.for("IAdminAuthService"),
  IAdminAuthRepository: Symbol.for("IAdminRepository"),
  IAdminNutritionistController: Symbol.for("IAdminNutritionistController"),
  IAdminNutritionistService: Symbol.for("IAdminNutritionistService"),
  IAdminNutritionistRepository: Symbol.for("IAdminNutritionistRepository"),
  IAdminClientController: Symbol.for("IAdminClientController"),
  IAdminClientService: Symbol.for("IAdminClientService"),
  IAdminNotificationController: Symbol.for("IAdminNotificationController"),
  INotificationRepository: Symbol.for("INotificationRepository"),
  INotificationService: Symbol.for("INotificationService"),
  IAdminPlanService: Symbol.for("IAdminPlanService"),
  IAdminPlanController: Symbol.for("IAdminPlanController"),
  IAdminChallengeService: Symbol.for("IAdminChallengeService"),
  IAdminChallengeController: Symbol.for("IAdminChallengeController"),
  IAdminUserRepository:Symbol.for("IAdminUserRepository"),



  //Nutritionist
  INutritionistAuthController: Symbol.for("INutritionistAuthController"),
  INutritionistAuthService: Symbol.for("INutritionistAuthService"),
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
  INutriSessionService: Symbol.for("INutriSessionService"),
  INutriSessionController: Symbol.for("INutriSessionController"),

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
  IJoinRequestRepository: Symbol.for("IJoinRequestRepository"),

  // socket
  ISocketService: Symbol.for("ISocketService"),

  // session
  ISessionRepository: Symbol.for("ISessionRepository"),
  ISessionParticipantRepository: Symbol.for("ISessionParticipantRepository"),

  // challenge
  IChallengeRepository: Symbol.for("IChallengeRepository"),
  IChallengeTemplateRepository: Symbol.for("IChallengeTemplateRepository"),
  ITaskLibraryRepository: Symbol.for("ITaskLibraryRepository"),
  ITaskRepository: Symbol.for("ITaskRepository"),
  IUserChallengeRepository: Symbol.for("IUserChallengeRepository"),
  IUserTaskProgressRepository: Symbol.for("IUserTaskProgressRepository"),
};
