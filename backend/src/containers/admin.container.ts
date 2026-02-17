import { container } from "./index";
import { TYPES } from "../types/types";

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

