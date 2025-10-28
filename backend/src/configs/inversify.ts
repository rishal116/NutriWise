import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../types/types";

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

// Create container
const container = new Container();

// Bindings
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);  // ✅ fixed
container.bind<IOTPService>(TYPES.IOTPService).to(OtpService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

export { container };
