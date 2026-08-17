import cron from "node-cron";

import { UserProgramModel } from "../models/userProgram.model";
import { UserProgramProgressModel } from "../models/userProgramProgress.model";
import {
  UserDayTrackingModel,
  UserDayTrackingStatus,
} from "../models/userDayTracking.model";
import logger from "../utils/logger";

const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const calculateCurrentDay = (
  startDate: Date,
  durationDays: number,
  now: Date,
): number => {
  const start = getStartOfDay(startDate);
  const today = getStartOfDay(now);

  const diffMs = today.getTime() - start.getTime();

  const elapsedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.min(Math.max(elapsedDays + 1, 1), durationDays);
};

const syncProgramProgress = async (): Promise<void> => {
  const now = new Date();

  const activePrograms = await UserProgramModel.find({
    status: "active",
    isDeleted: false,
    startDate: {
      $lte: now,
    },
    endDate: {
      $gt: now,
    },
  }).select("_id userId startDate durationDays");

  for (const program of activePrograms) {
    const currentDay = calculateCurrentDay(
      program.startDate,
      program.durationDays,
      now,
    );

    await UserProgramProgressModel.updateOne(
      {
        userProgramId: program._id,
        userId: program.userId,
      },
      {
        $set: {
          currentDay,
        },
      },
    );

    await UserDayTrackingModel.updateMany(
      {
        userProgramId: program._id,
        userId: program.userId,
        dayNumber: {
          $lt: currentDay,
        },
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
  }

  if (activePrograms.length > 0) {
    logger.info("Program progress synchronized", {
      count: activePrograms.length,
    });
  }
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
  cron.schedule("0 * * * *", async () => {
    await runProgramProgressSync();
  });

  logger.info("Program progress cron started");
};
