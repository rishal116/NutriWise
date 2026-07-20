import cron from "node-cron";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";

import { IUserPlanRepository } from "../repositories/interfaces/user/IUserPlanRepository";
import { IUserProgramRepository } from "../repositories/interfaces/user/IUserProgramRepository";

import logger from "../utils/logger";

export const startCoachingLifecycleCron = () => {
  const userPlanRepo = container.get<IUserPlanRepository>(
    TYPES.IUserPlanRepository,
  );

  const userProgramRepo = container.get<IUserProgramRepository>(
    TYPES.IUserProgramRepository,
  );

  // Runs at the start of every hour
  cron.schedule("0 * * * *", async () => {
    logger.info("⏳ Coaching Lifecycle Cron Started");

    try {
      const [
        activatedPlans,
        expiredPlans,
        activatedPrograms,
        completedPrograms,
      ] = await Promise.all([
        userPlanRepo.activateUpcomingPlans(),
        userPlanRepo.expireActivePlans(),
        userProgramRepo.activateUpcomingPrograms(),
        userProgramRepo.completeActivePrograms(),
      ]);

      logger.info("✅ Coaching Lifecycle Cron Completed", {
        plansActivated: activatedPlans.modifiedCount,
        plansExpired: expiredPlans.modifiedCount,
        programsActivated: activatedPrograms.modifiedCount,
        programsCompleted: completedPrograms.modifiedCount,
      });
    } catch (error) {
      logger.error("❌ Coaching Lifecycle Cron Failed", error);
    }
  });
};
