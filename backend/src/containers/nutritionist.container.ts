import { container } from "./index";
import { TYPES } from "../types/types";

import { INutritionistAuthController } from "../controllers/interfaces/nutritionist/INutritionistAuthController";
import { NutritionistAuthController } from "../controllers/implementations/nutritionist/nutritionistAuth.controller";
import { INutritionistAuthService } from "../services/interfaces/nutritionist/INutritionistAuthService";
import { NutritionistAuthService } from "../services/implements/nutritionist/nutritionistAuth.service";

import { INutritionistProfileController } from "../controllers/interfaces/nutritionist/INutritionistProfileController";
import { NutritionistProfileController } from "../controllers/implementations/nutritionist/nutritionistProfile.controller";
import { INutritionistProfileService } from "../services/interfaces/nutritionist/INutritionistProfileService";
import { NutritionistProfileService } from "../services/implements/nutritionist/nutritionistProfile.service";
import { INutritionistProfileRepository } from "../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { NutritionistProfileRepository } from "../repositories/implements/nutritionist/nutritionistProfile.repository";

import { INutritionistPlanController } from "../controllers/interfaces/nutritionist/INutritionistPlanController";
import { NutritionistPlanController } from "../controllers/implementations/nutritionist/nutritionistPlan.controller";
import { INutritionistPlanService } from "../services/interfaces/nutritionist/INutritionistPlanService";
import { NutritionistPlanService } from "../services/implements/nutritionist/nutritionistPlan.service";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { NutritionistPlanRepository } from "../repositories/implements/nutritionist/nutritionistPlan.repository";

container.bind<INutritionistAuthController>(TYPES.INutritionistAuthController).to(NutritionistAuthController);
container.bind<INutritionistAuthService>(TYPES.INutritionistAuthService).to(NutritionistAuthService);
container.bind<INutritionistProfileController>(TYPES.INutritionistProfileController).to(NutritionistProfileController);
container.bind<INutritionistProfileService>(TYPES.INutritionistProfileService).to(NutritionistProfileService);
container.bind<INutritionistProfileRepository>(TYPES.INutritionistProfileRepository).to(NutritionistProfileRepository);
container.bind<INutritionistPlanController>(TYPES.INutritionistPlanController).to(NutritionistPlanController);
container.bind<INutritionistPlanService>(TYPES.INutritionistPlanService).to(NutritionistPlanService);
container.bind<INutritionistPlanRepository>(TYPES.INutritionistPlanRepository).to(NutritionistPlanRepository);

