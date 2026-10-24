import cron from "node-cron";

import { UserProgramModel } from "../models/userProgram.model";
import { UserDayTrackingModel } from "../models/userDayTracking.model";
import logger from "../utils/logger";

const TIME_ZONE = "Asia/Kolkata";
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getDayDifference(startDate: Date, today: Date): number {
  const startDateKey = getDateKey(startDate);
  const todayKey = getDateKey(today);

  const startTimestamp = Date.parse(`${startDateKey}T00:00:00.000Z`);
  const todayTimestamp = Date.parse(`${todayKey}T00:00:00.000Z`);

  return Math.floor((todayTimestamp - startTimestamp) / MILLISECONDS_PER_DAY);
}

export const startProgramDayUnlockCron = (): void => {
  cron.schedule(
    "0 0,10 * * *",
    async () => {
      try {
        logger.info("Starting program day unlock cron");

        const today = new Date();

        const programs = await UserProgramModel.find({
          status: "active",
        })
          .select({
            _id: 1,
            startDate: 1,
          })
          .lean();

        let unlockedPrograms = 0;

        await Promise.all(
          programs.map(async (program) => {
            const startDate = new Date(program.startDate);

            if (Number.isNaN(startDate.getTime())) {
              logger.warn("Skipping program with invalid start date", {
                userProgramId: program._id.toString(),
              });
              return;
            }

            const differenceInDays = getDayDifference(startDate, today);
            const currentDay = differenceInDays + 1;

            if (currentDay < 1) {
              return;
            }

            const result = await UserDayTrackingModel.updateMany(
              {
                userProgramId: program._id,
                dayNumber: { $lte: currentDay },
                isLocked: true,
              },
              {
                $set: { isLocked: false },
              },
            );

            if (result.modifiedCount > 0) {
              unlockedPrograms += 1;
            }
          }),
        );

        logger.info("Program day unlock cron completed successfully", {
          activePrograms: programs.length,
          unlockedPrograms,
        });
      } catch (error) {
        logger.error("Program day unlock cron failed", { error });
      }
    },
    {
      timezone: TIME_ZONE,
    },
  );

  logger.info("Program day unlock cron scheduled", {
    timezone: TIME_ZONE,
  });
};
