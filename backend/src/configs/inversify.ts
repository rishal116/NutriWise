import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../types/types";

// ---------------- USER ----------------
import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { UserAuthController } from "../controllers/implementations/user/userAuth.controller";
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { UserAuthService } from "../services/implements/user/userAuth.service";
import { IOTPService } from "../services/interfaces/IOtpService";
import { OtpService } from "../services/implements/otp.service";
import { IUserRepository } from "../repositories/interfaces/user/IUserRepository";
import { UserRepository } from "../repositories/implements/user/user.repository";
import { IOtpRepository } from "../repositories/interfaces/IOtpRepository";
import { OtpRepository } from "../repositories/implements/otp.repository";
import { NutritionistController } from "../controllers/implementations/user/nutritionists.controller";
import { INutritionistController } from "../controllers/interfaces/user/INutritionistsController";
import { NutritionistService } from "../services/implements/user/nutritionists.service";
import { INutritionistService } from "../services/interfaces/user/INutritionistsService";
import { UserProfileController } from "../controllers/implementations/user/userProfile.controller";
import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { IUserProfileService } from "../services/interfaces/user/IUserProfileService";
import { UserProfileService } from "../services/implements/user/userProfile.service";

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
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { NotificationRepository } from "../repositories/implements/notification.repository";

// ---------------- NUTRITIONIST ----------------
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { NutritionistAuthController } from "../controllers/implementations/nutritionist/nutritionistAuth.controller";
import { INutritionistAuthService } from "../services/interfaces/nutritionist/INutritionistAuthService";
import { NutritionistAuthService } from "../services/implements/nutritionist/nutritionistAuth.service";
import { INutritionistDetailsRepository } from "../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { NutritionistDetailsRepository } from "../repositories/implements/nutritionist/nutritionistDetails.repository";

import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { NutritionistProfileController } from "../controllers/implementations/nutritionist/nutritionistProfile.controller";
import { INutritionistProfileService } from "../services/interfaces/nutritionist/INutritionistProfileService";
import { NutritionistProfileService } from "../services/implements/nutritionist/nutritionistProfile.service";
import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutritionistProfile.repository";

import { INutritionistAvailabilityController } from "../controllers/interfaces/nutritionist/INutritionistAvailabilityController";
import { NutritionistAvailabilityController } from "../controllers/implementations/nutritionist/nutritionistAvailability.controller";
import { INutritionistAvailabilityService } from "../services/interfaces/nutritionist/INutritionistAvailabilityService";
import { NutritionistAvailabilityService } from "../services/implements/nutritionist/nutritionistAvailability.service";
import { INutritionistAvailabilityRepository } from "../repositories/interfaces/nutritionist/INutritionistAvailabilityRepository";
import { NutritionistAvailabilityRepository } from "../repositories/implements/nutritionist/nutritionistAvailability.repository";

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
container.bind<INutritionistDetailsRepository>(TYPES.INutritionistDetailsRepository).to(NutritionistDetailsRepository);

container.bind<INutritionistProfileController>(TYPES.INutritionistProfileController).to(NutritionistProfileController);
container.bind<INutritionistProfileService>(TYPES.INutritionistProfileService).to(NutritionistProfileService);
container.bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository).to(NutritionistProfileRepository);

container.bind<NutritionistAvailabilityController>(TYPES.INutritionistAvailabilityController).to(NutritionistAvailabilityController);
container.bind<INutritionistAvailabilityService>(TYPES.INutritionistAvailabilityService).to(NutritionistAvailabilityService);
container.bind<INutritionistAvailabilityRepository>(TYPES.INutritionistAvailabilityRepository).to(NutritionistAvailabilityRepository);






export { container };
