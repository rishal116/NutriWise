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
import { IUserProgramRepository } from "../repositories/interfaces/user/IUserProgramRepository";
import { UserProgramRepository } from "../repositories/implements/user/userProgram.repository";


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




// ---------------- NUTRITIONIST ----------------
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { NutritionistAuthController } from "../controllers/implementations/nutritionist/nutritionistAuth.controller";
import { INutritionistAuthService } from "../services/interfaces/nutritionist/INutritionistAuthService";
import { NutritionistAuthService } from "../services/implements/nutritionist/nutriAuth.service";


import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutritionistProfile.repository";

import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { NutritionistPlanController } from "../controllers/implementations/nutritionist/nutritionistPlan.controller";
import { INutritionistPlanService } from "../services/interfaces/nutritionist/INutritionistPlanService";
import { NutritionistPlanService } from "../services/implements/nutritionist/nutriPlan.service";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { NutritionistPlanRepository } from "../repositories/implements/nutritionist/nutritionistPlan.repository";
import { NutritionistSubscriptionController } from "../controllers/implementations/nutritionist/nutritionistSubscription.controller";
import { INutritionistSubscriptionController } from "../controllers/interfaces/nutritionist/INutritionistSubscriptionController";

import { INutriMeetingsController } from "../controllers/interfaces/nutritionist/INutriMeetingsController";
import { NutriMeetingsController } from "../controllers/implementations/nutritionist/nutriMeetings.controller";
import { INutriMeetingsService } from "../services/interfaces/nutritionist/INutriMeetingsService";
import { NutriMeetingsService } from "../services/implements/nutritionist/nutriMeetings.service";
import { INutriMeetingsRepository } from "../repositories/interfaces/nutritionist/INutriMeetingsRepository";
import { NutriMeetingsRepository } from "../repositories/implements/nutritionist/nutriMeetings.repository";

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
import { IWalletRepository } from "../repositories/interfaces/common/IWalletRepository";
import { WalletRepository } from "../repositories/implements/common/wallet.repository";
import { PaymentRepository } from "../repositories/implements/common/payment.repository";
import { IPaymentRepository } from "../repositories/interfaces/common/IPaymentRepository";


import { IConversationController } from "../controllers/interfaces/chat/IConversationController";
import { ConversationController } from "../controllers/implementations/chat/conversation.controller";
import { IMessageController } from "../controllers/interfaces/chat/IMessageController";
import { MessageController } from "../controllers/implementations/chat/message.controller";

import { IConversationService } from "../services/interfaces/chat/IConversationService";
import { ConversationService } from "../services/implements/chat/conversation.service";
import { IMessageService } from "../services/interfaces/chat/IMessageService";
import { MessageService } from "../services/implements/chat/message.service";

import { IConversationRepository } from "../repositories/interfaces/chat/IConversationRepository";
import { ConversationRepository } from "../repositories/implements/chat/conversation.repository";
import { IMessageRepository } from "../repositories/interfaces/chat/IMessageRepository";
import { MessageRepository } from "../repositories/implements/chat/message.repository";

import { IUserMeetingsController } from "../controllers/interfaces/user/IUserMeetingsController";
import { UserMeetingsController } from "../controllers/implementations/user/userMeetings.controller";
import { IUserMeetingsService } from "../services/interfaces/user/IUserMeetingsService";
import { UserMeetingsService } from "../services/implements/user/userMeetings.service";


// socket
import { ISocketService } from "../services/interfaces/socket/ISocketService";
import { SocketService } from "../services/implements/socket/socket.service";
import { INutriProgramController } from "../controllers/interfaces/nutritionist/INutriProgramController";
import { NutriProgramController } from "../controllers/implementations/nutritionist/nutriProgram.controller";
import { INutriProgramService } from "../services/interfaces/nutritionist/INutriProgramService";
import { NutriProgramService } from "../services/implements/nutritionist/nutriProgram.service";
import { IProgramDayRepository } from "../repositories/interfaces/user/IProgramDayRepository";
import { ProgramDayRepository } from "../repositories/implements/user/programDay.repository";
import { IUserProgramController } from "../controllers/interfaces/user/IUserProgramController";
import { UserProgramController } from "../controllers/implementations/user/userProgram.controller";
import { IUserProgramService } from "../services/interfaces/user/IUserProgramService";
import { UserProgramService } from "../services/implements/user/userProgram.service";
import { ITaskController } from "../controllers/interfaces/user/ITaskController";
import { TaskController } from "../controllers/implementations/user/task.controller";
import { ITaskService } from "../services/interfaces/user/ITaskService";
import { TaskService } from "../services/implements/user/task.service";
import { ITaskLogRepository } from "../repositories/interfaces/user/ITaskLogRepository";
import { TaskLogRepository } from "../repositories/implements/user/taskLog.repository";
import { IConversationMemberRepository } from "../repositories/interfaces/chat/IConversationMemberRepository";
import { ConversationMemberRepository } from "../repositories/implements/chat/conversationMember.repository";
import { IMessageReceiptRepository } from "../repositories/interfaces/chat/IMessageReceiptRepository";
import { MessageReceiptRepository } from "../repositories/implements/chat/messageReceipt.repository";
import { INutriSubscriptionService } from "../services/interfaces/nutritionist/INutriSubcriptionService";
import { NutriSubscriptionService } from "../services/implements/nutritionist/nutriSubscription.service";
import { IHealthProgressRepository } from "../repositories/interfaces/user/IHealthProgressRepository";
import { IHealthProgressService } from "../services/interfaces/user/IHealthProgress.Service";
import { HealthProgressService } from "../services/implements/user/healthProgress.service";
import { HealthDetailsService } from "../services/implements/user/healthDetails.service";
import { IHealthProgressController } from "../controllers/interfaces/user/IHealthProgressController";
import { HealthProgressController } from "../controllers/implementations/user/healthProgress.controller";
import { HealthProgressRepository } from "../repositories/implements/user/healthProgress.repository";
import { IReviewController } from "../controllers/interfaces/user/IReviewController";
import { ReviewController } from "../controllers/implementations/user/review.controller";
import { IReviewService } from "../services/interfaces/user/IReviewService";
import { ReviewService } from "../services/implements/user/review.service";
import { IReviewRepository } from "../repositories/interfaces/user/IReviewRepository";
import { ReviewRepository } from "../repositories/implements/user/review.repository";
import { INutriGroupController } from "../controllers/interfaces/nutritionist/INutriGroupController";
import { NutriGroupController } from "../controllers/implementations/nutritionist/nutriGroup.controller";
import { INutriGroupService } from "../services/interfaces/nutritionist/INutriGroupService";
import { NutriGroupService } from "../services/implements/nutritionist/nutriGroup.service";



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
container.bind<IUserProgramRepository>(TYPES.IUserProgramRepository).to(UserProgramRepository)
container.bind<IProgramDayRepository>(TYPES.IProgramDayRepository).to(ProgramDayRepository)
container.bind<IUserProgramController>(TYPES.IUserProgramController).to(UserProgramController)
container.bind<IUserProgramService>(TYPES.IUserProgramService).to(UserProgramService)
container.bind<ITaskController>(TYPES.ITaskController).to(TaskController)
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService)
container.bind<ITaskLogRepository>(TYPES.ITaskLogRepository).to(TaskLogRepository)
container.bind<IHealthProgressRepository>(TYPES.IHealthProgressRepository).to(HealthProgressRepository)
container.bind<IHealthProgressService>(TYPES.IHealthProgressService).to(HealthProgressService)
container.bind<IHealthProgressController>(TYPES.IHealthProgressController).to(HealthProgressController)
container.bind<IReviewController>(TYPES.IReviewController).to(ReviewController)
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService)
container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository)




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


// -------- NUTRITIONIST BINDINGS --------
container.bind<INutritionistAuthController>(TYPES.INutritionistAuthController).to(NutritionistAuthController);
container.bind<INutritionistAuthService>(TYPES.INutritionistAuthService).to(NutritionistAuthService);
container.bind<IUserNutritionistProfileRepository>(TYPES.IUserNutritionistProfileRepository).to(UserNutritionistRepository);


container.bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository).to(NutritionistProfileRepository);


container.bind<INutritionistPlanController>(TYPES.INutritionistPlanController).to(NutritionistPlanController);
container.bind<INutritionistPlanService>(TYPES.INutritionistPlanService).to(NutritionistPlanService);
container.bind<INutritionistPlanRepository>(TYPES.INutritionistPlanRepository).to(NutritionistPlanRepository);

container.bind<INutritionistSubscriptionController>(TYPES.INutritionistSubscriptionController).to(NutritionistSubscriptionController);

container.bind<INutriMeetingsController>(TYPES.INutriMeetingsController).to(NutriMeetingsController)
container.bind<INutriMeetingsService>(TYPES.INutriMeetingsService).to(NutriMeetingsService)
container.bind<INutriMeetingsRepository>(TYPES.INutriMeetingsRepository).to(NutriMeetingsRepository)
container.bind<INutriProgramController>(TYPES.INutriProgramController).to(NutriProgramController)
container.bind<INutriProgramService>(TYPES.INutriProgramService).to(NutriProgramService)
container.bind<INutriSubscriptionService>(TYPES.INutriSubscriptionService).to(NutriSubscriptionService)
container.bind<INutriGroupController>(TYPES.INutriGroupController).to(NutriGroupController)
container.bind<INutriGroupService>(TYPES.INutriGroupService).to(NutriGroupService)



// common
container.bind<ICheckoutService>(TYPES.ICheckoutService).to(CheckoutService);

container.bind<ICheckoutController>(TYPES.ICheckoutController).to(CheckoutController);

container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);
container.bind<IStripeWebhookService>(TYPES.IStripeWebhookService).to(StripeWebhookService);

container.bind<IStripeWebhookController>(TYPES.IStripeWebhookController).to(StripeWebhookController);
container.bind<IWalletRepository>(TYPES.IWalletRepository).to(WalletRepository);
container.bind<IPaymentRepository>(TYPES.IPaymentRepository).to(PaymentRepository);

// community




// chat
container.bind<IConversationController>(TYPES.IConversationController).to(ConversationController)
container.bind<IMessageController>(TYPES.IMessageController).to(MessageController)
container.bind<IConversationService>(TYPES.IConversationService).to(ConversationService)
container.bind<IMessageService>(TYPES.IMessageService).to(MessageService)
container.bind<IConversationRepository>(TYPES.IConversationRepository).to(ConversationRepository)
container.bind<IMessageRepository>(TYPES.IMessageRepository).to(MessageRepository)
container.bind<IConversationMemberRepository>(TYPES.IConversationMemberRepository).to(ConversationMemberRepository)
container.bind<IMessageReceiptRepository>(TYPES.IMessageReceiptRepository).to(MessageReceiptRepository)


// video
container.bind<IUserMeetingsController>(TYPES.IUserMeetingsController).to(UserMeetingsController)
container.bind<IUserMeetingsService>(TYPES.IUserMeetingsService).to(UserMeetingsService)

// socket
container.bind<ISocketService>(TYPES.ISocketService).to(SocketService)

export { container };
