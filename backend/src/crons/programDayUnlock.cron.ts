import cron from "node-cron";
import { UserProgramModel } from "../models/userProgram.model";
import { UserDayTrackingModel } from "../models/userDayTracking.model";
import logger from "../utils/logger";

export const startProgramDayUnlockCron = (): void => {
  cron.schedule("0 0 * * *", async () => {
    try {
      logger.info("Starting program day unlock cron");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const programs = await UserProgramModel.find({
        status: "active",
      })
        .select({
          _id: 1,
          startDate: 1,
        })
        .lean();

      for (const program of programs) {
        const startDate = new Date(program.startDate);
        startDate.setHours(0, 0, 0, 0);

        const differenceInMilliseconds = today.getTime() - startDate.getTime();

        const differenceInDays = Math.floor(
          differenceInMilliseconds / (1000 * 60 * 60 * 24),
        );

        const currentDay = differenceInDays + 1;

        if (currentDay < 1) {
          continue;
        }

        await UserDayTrackingModel.updateMany(
          {
            userProgramId: program._id,
            dayNumber: {
              $lte: currentDay,
            },
            isLocked: true,
          },
          {
            $set: {
              isLocked: false,
            },
          },
        );
      }

      logger.info("Program day unlock cron completed successfully");
    } catch (error) {
      logger.error("Program day unlock cron failed", {
        error,
      });
    }
  });

  logger.info("Program day unlock cron scheduled");
};
