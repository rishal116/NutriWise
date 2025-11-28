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
import { AdminUsersController } from "../controllers/implementations/admin/adminUsers.controller";
import { IAdminUsersController } from "../controllers/interfaces/admin/IAdminUsersController";

import { IAdminAuthService } from "../services/interfaces/admin/IAdminAuthService";
import { AdminAuthService } from "../services/implements/admin/adminAuth.service";
import { IAdminUsersService } from "../services/interfaces/admin/IAdminUsersService";
import { AdminUsersService } from "../services/implements/admin/adminUsers.service";

import { IAdminRepository } from "../repositories/interfaces/admin/IAdminRepository";
import { AdminRepository } from "../repositories/implements/admin/admin.repository";

import { IAdminNotificationController } from "../controllers/interfaces/admin/IAdminNotificationController";
import { AdminNotificationController } from "../controllers/implementations/admin/adminNotification.controller";
import { IAdminNotificationService } from "../services/interfaces/INotificationService";
import { AdminNotificationService } from "../services/implements/notification.service";
import { IAdminNotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { AdminNotificationRepository } from "../repositories/implements/notification.repository";

// ---------------- NUTRITIONIST ----------------
import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { NutritionistAuthController } from "../controllers/implementations/nutritionist/nutritionistAuth.controller";
import { INutritionistAuthService } from "../services/interfaces/nutritionist/INutritionistAuthService";
import { NutritionistAuthService } from "../services/implements/nutritionist/nutritionistAuth.service";
import { INutritionistDetailsRepository } from "../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { NutritionistDetailsRepository } from "../repositories/implements/nutritionist/nutritionistDetails.repository";

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
container.bind<IAdminUsersController>(TYPES.IAdminUsersController).to(AdminUsersController);
container.bind<IAdminUsersService>(TYPES.IAdminUsersService).to(AdminUsersService);
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);

container.bind<IAdminNotificationController>(TYPES.IAdminNotificationController).to(AdminNotificationController);
container.bind<IAdminNotificationService>(TYPES.IAdminNotificationService).to(AdminNotificationService);
container.bind<IAdminNotificationRepository>(TYPES.IAdminNotificationRepository).to(AdminNotificationRepository);

// -------- NUTRITIONIST BINDINGS --------
container.bind<INutritionistAuthController>(TYPES.INutritionistAuthController).to(NutritionistAuthController);
container.bind<INutritionistAuthService>(TYPES.INutritionistAuthService).to(NutritionistAuthService);
container.bind<INutritionistDetailsRepository>(TYPES.INutritionistDetailsRepository).to(NutritionistDetailsRepository);

export { container };
