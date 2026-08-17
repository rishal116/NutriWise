import cron from "node-cron";

import { UserProgramModel } from "../models/userProgram.model";
import logger from "../utils/logger";

const activatePrograms = async (): Promise<void> => {
  const now = new Date();

  const result = await UserProgramModel.updateMany(
    {
      status: "upcoming",
      isDeleted: false,
      startDate: {
        $lte: now,
      },
      endDate: {
        $gt: now,
      },
    },
    {
      $set: {
        status: "active",
      },
    },
  );

  if (result.modifiedCount > 0) {
    logger.info("Programs activated", {
      count: result.modifiedCount,
    });
  }
};

const completePrograms = async (): Promise<void> => {
  const now = new Date();

  const result = await UserProgramModel.updateMany(
    {
      status: "active",
      isDeleted: false,
      endDate: {
        $lte: now,
      },
    },
    {
      $set: {
        status: "completed",
        "lifecycle.completedAt": now,
      },
    },
  );

  if (result.modifiedCount > 0) {
    logger.info("Programs completed", {
      count: result.modifiedCount,
    });
  }
};

export const runProgramLifecycle = async (): Promise<void> => {
  try {
    await activatePrograms();
    await completePrograms();
  } catch (error) {
    logger.error("Program lifecycle processing failed", {
      error,
    });
  }
};

export const startProgramLifecycleCron = (): void => {
  cron.schedule("0 * * * *", async () => {
    await runProgramLifecycle();
  });

  logger.info("Program lifecycle cron started");
};