import cron from "node-cron";
import { container } from "../configs/inversify";
import { TYPES } from "../types/types";
import { IUserPlanRepository } from "../repositories/interfaces/user/IUserPlanRepository";
import { IUserProgramRepository } from "../repositories/interfaces/user/IUserProgramRepository";
import logger from "../utils/logger";

export const startSubscriptionCron = () => {
  const userPlanRepo = container.get<IUserPlanRepository>(
    TYPES.IUserPlanRepository,
  );

  const userProgramRepo = container.get<IUserProgramRepository>(
    TYPES.IUserProgramRepository,
  );

  cron.schedule("0 * * * *", async () => {
    logger.info("⏳ Subscription Cron Started");

    try {
      const activatedPlans = await userPlanRepo.activateUpcomingPlans();

      const expiredPlans = await userPlanRepo.expireActivePlans();

      const activatedPrograms = await userProgramRepo.activatePrograms();

      const completedPrograms = await userProgramRepo.completePrograms();

      logger.info("✅ Subscription Cron Completed", {
        plansActivated: activatedPlans.modifiedCount,
        plansExpired: expiredPlans.modifiedCount,
        programsActivated: activatedPrograms.modifiedCount,
        programsCompleted: completedPrograms.modifiedCount,
      });
    } catch (error) {
      logger.error("❌ Subscription Cron Failed", error);
    }
  });
};
