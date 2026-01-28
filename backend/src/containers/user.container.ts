import { container } from "./index";
import { TYPES } from "../types/types";

import { IUserAuthController } from "../controllers/interfaces/user/IUserAuthController";
import { UserAuthController } from "../controllers/implementations/user/userAuth.controller";
import { IUserAuthService } from "../services/interfaces/user/IUserAuthService";
import { UserAuthService } from "../services/implements/user/userAuth.service";



import { IUserRepository } from "../repositories/interfaces/user/IUserRepository";
import { UserRepository } from "../repositories/implements/user/user.repository";

import { INutritionistController } from "../controllers/interfaces/user/INutritionistsController";
import { NutritionistController } from "../controllers/implementations/user/nutritionists.controller";
import { INutritionistService } from "../services/interfaces/user/INutritionistsService";
import { NutritionistService } from "../services/implements/user/nutritionists.service";

import { IUserProfileController } from "../controllers/interfaces/user/IUserProfileController";
import { UserProfileController } from "../controllers/implementations/user/userProfile.controller";
import { IUserProfileService } from "../services/interfaces/user/IUserProfileService";
import { UserProfileService } from "../services/implements/user/userProfile.service";

import { IHealthDetailsController } from "../controllers/interfaces/user/IHealthDetailsController";
import { HealthDetailsController } from "../controllers/implementations/user/healthDetails.controller";
import { IHealthDetailsService } from "../services/interfaces/user/IHealthDetailsService";
import { HealthDetailsService } from "../services/implements/user/healthDetails.service";
import { IHealthDetailsRepository } from "../repositories/interfaces/user/IHealthDetailsRepository";
import { HealthDetailsRepository } from "../repositories/implements/user/healthDetails.repository";

import { IUserPlanRepository } from "../repositories/interfaces/user/IUserPlanRepository";
import { UserPlanRepository } from "../repositories/implements/user/userPlan.repository";
import { IUserPlanController } from "../controllers/interfaces/user/IUserPlanController";
import { UserPlanController } from "../controllers/implementations/user/userPlan.controller";
import { IUserPlanService } from "../services/interfaces/user/IUserPlanService";
import { UserPlanService } from "../services/implements/user/userPlan.service";

import { IUserNutritionistProfileRepository } from "../repositories/interfaces/user/IUserNutritionistProfileRepository";
import { UserNutritionistRepository } from "../repositories/implements/user/userNutritionistProfile.repository";

// -------- USER BINDINGS --------
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IUserAuthService>(TYPES.IUserAuthService).to(UserAuthService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);



container.bind<INutritionistController>(TYPES.INutritionistController).to(NutritionistController);
container.bind<INutritionistService>(TYPES.INutritionistService).to(NutritionistService);

container.bind<IUserProfileController>(TYPES.IUserProfileController).to(UserProfileController);
container.bind<IUserProfileService>(TYPES.IUserProfileService).to(UserProfileService);

container.bind<IHealthDetailsController>(TYPES.IHealthDetailsController).to(HealthDetailsController);
container.bind<IHealthDetailsRepository>(TYPES.IHealthDetailsRepository).to(HealthDetailsRepository);
container.bind<IHealthDetailsService>(TYPES.IHealthDetailsService).to(HealthDetailsService);

container.bind<IUserPlanRepository>(TYPES.IUserPlanRepository).to(UserPlanRepository);
container.bind<IUserPlanController>(TYPES.IUserPlanController).to(UserPlanController);
container.bind<IUserPlanService>(TYPES.IUserPlanService).to(UserPlanService);

container.bind<IUserNutritionistProfileRepository>(TYPES.IUserNutritionistProfileRepository).to(UserNutritionistRepository);
