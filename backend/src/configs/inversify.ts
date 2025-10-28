import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../types/types";

// ========================
// 🧩 User Imports
// ========================

// Controllers
import { IUserAuthController } from "../controllers/user/interface/IUserAuthController";
import { UserAuthController } from "../controllers/user/implementation/userAuth.controller";

// Services
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { UserAuthService } from "../services/implements/user/userAuth.service";
import { IOTPService } from "../services/interfaces/IOtpService";
import { OtpService } from "../services/implements/otp.service";

// Repositories
import { IUserRepository } from "../repositories/interfaces/user/IUserRepository";
import { UserRepository } from "../repositories/implements/user/user.repository";
import { IOtpRepository } from "../repositories/interfaces/IOtpRepository";
import { OtpRepository } from "../repositories/implements/otp.repository";


// ========================
//  Admin Imports
// ========================

// Controllers
import { IAdminAuthController } from "../controllers/admin/interface/IAdminAuthController.ts";
import { AdminAuthController } from "../controllers/admin/implementation/adminAuth.controller";

// Services
import { IAdminAuthService } from "../services/interfaces/admin/IAdminAuthService";
import { AdminAuthService } from "../services/implements/admin/adminAuth.service";

// Repositories
import { IAdminRepository } from "../repositories/interfaces/admin/IAdminRepository";
import { AdminRepository } from "../repositories/implements/admin/admin.repository";


// ========================
// Create Container
// ========================
const container = new Container();


// ========================
// User Bindings
// ========================
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IOTPService>(TYPES.IOTPService).to(OtpService);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);


// ========================
//  Admin Bindings
// ========================
container.bind<IAdminAuthController>(TYPES.IAdminAuthController).to(AdminAuthController);
container.bind<IAdminAuthService>(TYPES.IAdminAuthService).to(AdminAuthService);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);

export { container };

