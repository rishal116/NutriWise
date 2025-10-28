"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("../types/types");
const userAuth_controller_1 = require("../controllers/user/implementation/userAuth.controller");
const userAuth_service_1 = require("../services/implements/user/userAuth.service");
const otp_service_1 = require("../services/implements/otp.service");
const user_repository_1 = require("../repositories/implements/user/user.repository");
const otp_repository_1 = require("../repositories/implements/otp.repository");
const adminAuth_controller_1 = require("../controllers/admin/implementation/adminAuth.controller");
const adminAuth_service_1 = require("../services/implements/admin/adminAuth.service");
const admin_repository_1 = require("../repositories/implements/admin/admin.repository");
// ========================
// Create Container
// ========================
const container = new inversify_1.Container();
exports.container = container;
// ========================
// User Bindings
// ========================
container.bind(types_1.TYPES.IUserAuthController).to(userAuth_controller_1.UserAuthController);
container.bind(types_1.TYPES.IUserAuthService).to(userAuth_service_1.UserAuthService);
container.bind(types_1.TYPES.IUserRepository).to(user_repository_1.UserRepository);
container.bind(types_1.TYPES.IOTPService).to(otp_service_1.OtpService);
container.bind(types_1.TYPES.IOtpRepository).to(otp_repository_1.OtpRepository);
// ========================
//  Admin Bindings
// ========================
container.bind(types_1.TYPES.IAdminAuthController).to(adminAuth_controller_1.AdminAuthController);
container.bind(types_1.TYPES.IAdminAuthService).to(adminAuth_service_1.AdminAuthService);
container.bind(types_1.TYPES.IAdminRepository).to(admin_repository_1.AdminRepository);
