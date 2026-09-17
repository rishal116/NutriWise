export const TYPES = {
  // ======================================================
  // COMMON
  // ======================================================

  // Controllers
  ICheckoutController: Symbol.for("ICheckoutController"),
  IStripeWebhookController: Symbol.for("IStripeWebhookController"),
  IConversationController: Symbol.for("IConversationController"),
  IMessageController: Symbol.for("IMessageController"),
  IPublicSessionController: Symbol.for("IPublicSessionController"),
  ISessionCheckoutController: Symbol.for("ISessionCheckoutController"),
  ISessionRegistrationController: Symbol.for("ISessionRegistrationController"),
  ISessionRoomController: Symbol.for("ISessionRoomController"),
  IPublicChallengeController: Symbol.for("IPublicChallengeController"),
  IPublicGroupController: Symbol.for("IPublicGroupController"),

  // Services
  IStripeService: Symbol.for("IStripeService"),
  ICheckoutService: Symbol.for("ICheckoutService"),
  IStripeWebhookService: Symbol.for("IStripeWebhookService"),
  ISocketService: Symbol.for("ISocketService"),
  IConversationService: Symbol.for("IConversationService"),
  IMessageService: Symbol.for("IMessageService"),
  IStripeCheckoutHandlerService: Symbol.for("IStripeCheckoutHandlerService"),
  IPublicSessionService: Symbol.for("IPublicSessionService"),
  ISessionCheckoutService: Symbol.for("ISessionCheckoutService"),
  ISessionRegistrationService: Symbol.for("ISessionRegistrationService"),
  ILiveKitService: Symbol.for("ILiveKitService"),
  ISessionRoomService: Symbol.for("ISessionRoomService"),
  IPublicChallengeService: Symbol.for("IPublicChallengeService"),
  IPublicGroupService: Symbol.for("IPublicGroupService"),

  // Repositories
  IWalletRepository: Symbol.for("IWalletRepository"),
  IPaymentRepository: Symbol.for("IPaymentRepository"),
  IConversationRepository: Symbol.for("IConversationRepository"),
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationMemberRepository: Symbol.for("IConversationMemberRepository"),
  IMessageReceiptRepository: Symbol.for("IMessageReceiptRepository"),
  INotificationRepository: Symbol.for("INotificationRepository"),
  IResourceRepository: Symbol.for("IResourceRepository"),
  ISessionRepository: Symbol.for("ISessionRepository"),
  ISessionRegistrationRepository: Symbol.for("ISessionRegistrationRepository"),
  IResourceViewRepository: Symbol.for("IResourceViewRepository"),
  IResourceDownloadRepository: Symbol.for("IResourceDownloadRepository"),
  IResourceLikeRepository: Symbol.for("IResourceLikeRepository"),
  IResourceBookmarkRepository: Symbol.for("IResourceBookmarkRepository"),
  IResourceCommentRepository: Symbol.for("IResourceCommentRepository"),
  IPublicChallengeRepository: Symbol.for("IPublicChallengeRepository"),
  IPublicGroupRepository: Symbol.for("IPublicGroupRepository"),

  // Shared Services
  INotificationService: Symbol.for("INotificationService"),
  IOTPService: Symbol.for("IOTPService"),

  // Shared Repositories
  IOtpRepository: Symbol.for("IOtpRepository"),
  IPasswordResetRepository: Symbol.for("IPasswordResetRepository"),

  // ======================================================
  // USER
  // ======================================================

  // Controllers
  IUserAuthController: Symbol.for("IUserAuthController"),
  IUserProfileController: Symbol.for("IUserProfileController"),
  IHealthDetailsController: Symbol.for("IHealthDetailsController"),
  IUserPlanController: Symbol.for("IUserPlanController"),
  IUserAccountController: Symbol.for("IUserAccountController"),
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
  IUserActivityTrackingController: Symbol.for(
    "IUserActivityTrackingController",
  ),
  IUserMeetingController: Symbol.for("IUserMeetingController"),
  IPublicResourceController: Symbol.for("IPublicResourceController"),
  IUserChallengeController: Symbol.for("IUserChallengeController"),
  IUserChallengeTrackingController: Symbol.for(
    "IUserChallengeTrackingController",
  ),
  IUserPostController: Symbol.for("IUserPostController"),
  IUserDashboardController:Symbol.for("IUserDashboardController"),

  // Services
  IUserAuthService: Symbol.for("IUserAuthService"),
  IUserProfileService: Symbol.for("IUserProfileService"),
  IHealthDetailsService: Symbol.for("IHealthDetailsService"),
  IUserPlanService: Symbol.for("IUserPlanService"),
  IUserAccountService: Symbol.for("IUserAccountService"),
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
  IUserDayTrackingService: Symbol.for("IUserDayTrackingService"),
  IUserActivityTrackingService: Symbol.for("IUserActivityTrackingService"),
  IUserMeetingService: Symbol.for("IUserMeetingService"),
  IPublicResourceService: Symbol.for("IPublicResourceService"),
  IUserChallengeService: Symbol.for("IUserChallengeService"),
  IUserChallengeTrackingService: Symbol.for("IUserChallengeTrackingService"),
  IUserPostService: Symbol.for("IUserPostService"),
  IUserDashboardService:Symbol.for("IUserDashboardService"),

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
  IUserDayTrackingRepository: Symbol.for("IUserDayTrackingRepository"),
  IUserActivityTrackingRepository: Symbol.for(
    "IUserActivityTrackingRepository",
  ),
  IUserProgramBrowseRepository: Symbol.for("IUserProgramBrowseRepository"),
  IUserMeetingRepository: Symbol.for("IUserMeetingRepository"),
  IUserPostRepository: Symbol.for("IUserPostRepository"),
  IUserChallengeRepository: Symbol.for("IUserChallengeRepository"),
  IUserChallengeProgressRepository: Symbol.for(
    "IUserChallengeProgressRepository",
  ),
  IUserDashboardRepository:Symbol.for("IUserDashboardRepository"),

  // ======================================================
  // ADMIN
  // ======================================================

  // Controllers
  IAdminUserController: Symbol.for("IAdminUserController"),
  IAdminNutritionistController: Symbol.for("IAdminNutritionistController"),
  IAdminNutritionistApplicationController: Symbol.for(
    "IAdminNutritionistApplicationController",
  ),
  IAdminNotificationController: Symbol.for("IAdminNotificationController"),
  IAdminPlanController: Symbol.for("IAdminPlanController"),
  IAdminChallengeController: Symbol.for("IAdminChallengeController"),
  IAdminChallengeDayController: Symbol.for("IAdminChallengeDayController"),
  IAdminDashboardController:Symbol.for("IAdminDashboardController"),

  // Services
  IAdminUserService: Symbol.for("IAdminUserService"),
  IAdminNutritionistService: Symbol.for("IAdminNutritionistService"),
  IAdminNutritionistApplicationService: Symbol.for(
    "IAdminNutritionistApplicationService",
  ),
  IAdminPlanService: Symbol.for("IAdminPlanService"),
  IAdminChallengeService: Symbol.for("IAdminChallengeService"),
  IAdminChallengeDayService: Symbol.for("IAdminChallengeDayService"),
  IAdminDashboardService:Symbol.for("IAdminDashboardService"),

  // Repositories
  IAdminUserRepository: Symbol.for("IAdminUserRepository"),
  IAdminNutritionistRepository: Symbol.for("IAdminNutritionistRepository"),
  IAdminNutritionistApplicationRepository: Symbol.for(
    "IAdminNutritionistApplicationRepository",
  ),
  IAdminChallengeRepository: Symbol.for("IAdminChallengeRepository"),
  IAdminChallengeDayRepository: Symbol.for("IAdminChallengeDayRepository"),
  IAdminDashboardRepository: Symbol.for("IAdminDashboardRepository"),
  IAdminPlanRepository:Symbol.for("IAdminPlanRepository"),

  // ======================================================
  // NUTRITIONIST
  // ======================================================

  // Controllers
  INutritionistApplicationController: Symbol.for(
    "INutritionistApplicationController",
  ),
  INutritionistPlanController: Symbol.for("INutritionistPlanController"),
  INutriProgramController: Symbol.for("INutriProgramController"),
  INutriMeetingController: Symbol.for("INutriMeetingController"),
  INutriGroupController: Symbol.for("INutriGroupController"),
  INutriClientController: Symbol.for("INutriClientController"),
  INutriProgramDayController: Symbol.for("INutriProgramDayController"),
  INutriResourceController: Symbol.for("INutriResourceController"),
  INutriSessionController: Symbol.for("INutriSessionController"),
  INutriDashboardController:Symbol.for("INutriDashboardController"),

  // Services
  INutritionistApplicationService: Symbol.for(
    "INutritionistApplicationService",
  ),
  INutritionistPlanService: Symbol.for("INutritionistPlanService"),
  INutriProgramService: Symbol.for("INutriProgramService"),
  INutriMeetingService: Symbol.for("INutriMeetingService"),
  INutriGroupService: Symbol.for("INutriGroupService"),
  INutriClientService: Symbol.for("INutriClientService"),
  INutriProgramDayService: Symbol.for("INutriProgramDayService"),
  INutriResourceService: Symbol.for("INutriResourceService"),
  INutriSessionService: Symbol.for("INutriSessionService"),
  INutriDashboardService:Symbol.for("INutriDashboardService"),

  // Repositories
  INutritionistAuthRepository: Symbol.for("INutritionistAuthRepository"),
  INutritionistDetailsRepository: Symbol.for("INutritionistDetailsRepository"),
  INutritionistProfileRepository: Symbol.for("INutritionistProfileRepository"),
  INutritionistPlanRepository: Symbol.for("INutritionistPlanRepository"),
  INutriMeetingRepository: Symbol.for("INutriMeetingRepository"),
  INutriClientRepository: Symbol.for("INutriClientRepository"),
  INutriProgramRepository: Symbol.for("INutriProgramRepository"),
  INutriProgramDayRepository: Symbol.for("INutriProgramDayRepository"),
  INutriResourceRepository: Symbol.for("INutriResourceRepository"),
  INutriSessionRepository: Symbol.for("INutriSessionRepository"),
  INutriGroupRepository: Symbol.for("INutriGroupRepository"),
  INutriDashboardRepository:Symbol.for("INutriDashboardRepository"),
} as const;
