"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("../types/types");
const userAuth_controller_1 = require("../controllers/implementations/user/userAuth.controller");
const userAuth_service_1 = require("../services/implements/user/userAuth.service");
const otp_service_1 = require("../services/implements/otp.service");
const user_repository_1 = require("../repositories/implements/user/user.repository");
const otp_repository_1 = require("../repositories/implements/otp.repository");
const adminAuth_controller_1 = require("../controllers/implementations/admin/adminAuth.controller");
const adminUsers_controller_1 = require("../controllers/implementations/admin/adminUsers.controller");
const adminAuth_service_1 = require("../services/implements/admin/adminAuth.service");
const adminUsers_service_1 = require("../services/implements/admin/adminUsers.service");
const admin_repository_1 = require("../repositories/implements/admin/admin.repository");
const adminNotification_controller_1 = require("../controllers/implementations/admin/adminNotification.controller");
const notification_service_1 = require("../services/implements/notification.service");
const notification_repository_1 = require("../repositories/implements/notification.repository");
const nutritionistAuth_controller_1 = require("../controllers/implementations/nutritionist/nutritionistAuth.controller");
const nutritionistAuth_service_1 = require("../services/implements/nutritionist/nutritionistAuth.service");
const nutritionistDetails_repository_1 = require("../repositories/implements/nutritionist/nutritionistDetails.repository");
// ---------------- CONTAINER ----------------
const container = new inversify_1.Container();
exports.container = container;
// -------- USER BINDINGS --------
container.bind(types_1.TYPES.IUserAuthController).to(userAuth_controller_1.UserAuthController);
container.bind(types_1.TYPES.IUserAuthService).to(userAuth_service_1.UserAuthService);
container.bind(types_1.TYPES.IUserRepository).to(user_repository_1.UserRepository);
container.bind(types_1.TYPES.IOTPService).to(otp_service_1.OtpService);
container.bind(types_1.TYPES.IOtpRepository).to(otp_repository_1.OtpRepository);
// -------- ADMIN BINDINGS --------
container.bind(types_1.TYPES.IAdminAuthController).to(adminAuth_controller_1.AdminAuthController);
container.bind(types_1.TYPES.IAdminUsersController).to(adminUsers_controller_1.AdminUsersController);
container.bind(types_1.TYPES.IAdminUsersService).to(adminUsers_service_1.AdminUsersService);
container.bind(types_1.TYPES.IAdminAuthService).to(adminAuth_service_1.AdminAuthService);
container.bind(types_1.TYPES.IAdminRepository).to(admin_repository_1.AdminRepository);
container.bind(types_1.TYPES.IAdminNotificationController).to(adminNotification_controller_1.AdminNotificationController);
container.bind(types_1.TYPES.IAdminNotificationService).to(notification_service_1.AdminNotificationService);
container.bind(types_1.TYPES.IAdminNotificationRepository).to(notification_repository_1.AdminNotificationRepository);
// -------- NUTRITIONIST BINDINGS --------
container.bind(types_1.TYPES.INutritionistAuthController).to(nutritionistAuth_controller_1.NutritionistAuthController);
container.bind(types_1.TYPES.INutritionistAuthService).to(nutritionistAuth_service_1.NutritionistAuthService);
container.bind(types_1.TYPES.INutritionistDetailsRepository).to(nutritionistDetails_repository_1.NutritionistDetailsRepository);
