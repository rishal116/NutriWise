import cron from "node-cron";

import { UserProgramModel } from "../models/userProgram.model";
import { UserProgramProgressModel } from "../models/userProgramProgress.model";
import {
  UserDayTrackingModel,
  UserDayTrackingStatus,
} from "../models/userDayTracking.model";
import logger from "../utils/logger";

const TIME_ZONE = "Asia/Kolkata";
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getDateKey = (date: Date): string => {
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
};

const getDayDifference = (startDate: Date, today: Date): number => {
  const startTimestamp = Date.parse(`${getDateKey(startDate)}T00:00:00.000Z`);
  const todayTimestamp = Date.parse(`${getDateKey(today)}T00:00:00.000Z`);

  return Math.floor((todayTimestamp - startTimestamp) / MILLISECONDS_PER_DAY);
};

const calculateCurrentDay = (
  startDate: Date,
  durationDays: number,
  now: Date,
): number => {
  const elapsedDays = getDayDifference(startDate, now);

  return Math.min(elapsedDays + 1, durationDays);
};

const syncProgramProgress = async (): Promise<void> => {
  const now = new Date();

  const activePrograms = await UserProgramModel.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gt: now },
  })
    .select("_id userId startDate durationDays")
    .lean();

  let synchronizedPrograms = 0;
  let updatedProgressRecords = 0;
  let markedMissedDays = 0;
  let missingProgressRecords = 0;

  for (const program of activePrograms) {
    const startDate = new Date(program.startDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      !Number.isInteger(program.durationDays) ||
      program.durationDays < 1
    ) {
      logger.warn("Skipping program with invalid date or duration", {
        userProgramId: program._id.toString(),
      });
      continue;
    }

    const elapsedDays = getDayDifference(startDate, now);

    if (elapsedDays < 0) {
      continue;
    }

    const currentDay = calculateCurrentDay(
      startDate,
      program.durationDays,
      now,
    );

    const progressResult = await UserProgramProgressModel.updateOne(
      {
        userProgramId: program._id,
        userId: program.userId,
      },
      {
        $set: { currentDay },
      },
    );

    if (progressResult.matchedCount === 0) {
      missingProgressRecords += 1;

      logger.warn("Program progress record not found", {
        userProgramId: program._id.toString(),
        userId: program.userId.toString(),
      });

      continue;
    }

    updatedProgressRecords += progressResult.modifiedCount;

    const missedResult = await UserDayTrackingModel.updateMany(
      {
        userProgramId: program._id,
        userId: program.userId,
        dayNumber: { $lt: currentDay },
        status: {
          $in: [
            UserDayTrackingStatus.NOT_STARTED,
            UserDayTrackingStatus.IN_PROGRESS,
          ],
        },
      },
      {
        $set: {
          status: UserDayTrackingStatus.MISSED,
        },
      },
    );

    markedMissedDays += missedResult.modifiedCount;
    synchronizedPrograms += 1;
  }

  logger.info("Program progress synchronization completed", {
    activePrograms: activePrograms.length,
    synchronizedPrograms,
    updatedProgressRecords,
    markedMissedDays,
    missingProgressRecords,
  });
};

export const runProgramProgressSync = async (): Promise<void> => {
  try {
    await syncProgramProgress();
  } catch (error) {
    logger.error("Program progress synchronization failed", {
      error,
    });
  }
};

export const startProgramProgressCron = (): void => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      await runProgramProgressSync();
    },
    {
      timezone: TIME_ZONE,
    },
  );

  logger.info("Program progress cron scheduled", {
    timezone: TIME_ZONE,
    schedule: "0 0 * * *",
  });
};
