import cron from "node-cron";

import { UserProgramModel } from "../models/userProgram.model";
import logger from "../utils/logger";

const activatePrograms = async (): Promise<void> => {
  const now = new Date();

  const result = await UserProgramModel.updateMany(
    {
      status: "ready",
      startDate: {
        $lte: now,
      },
    },
    {
      $set: {
        status: "active",
      },
    },
  );

  if (result.modifiedCount > 0) {
    logger.info("Programs activated successfully", {
      count: result.modifiedCount,
    });
  }
};

const completePrograms = async (): Promise<void> => {
  const now = new Date();

  const result = await UserProgramModel.updateMany(
    {
      status: "active",
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
    logger.info("Programs completed successfully", {
      count: result.modifiedCount,
    });
  }
};

export const runProgramLifecycle = async (): Promise<void> => {
  try {
    await activatePrograms();
  } catch (error) {
    logger.error("Failed to activate upcoming programs", { error });
  }

  try {
    await completePrograms();
  } catch (error) {
    logger.error("Failed to complete active programs", { error });
  }
};

export const startProgramLifecycleCron = (): void => {
  cron.schedule("*/10 * * * *", async () => {
    await runProgramLifecycle();
  });

  logger.info("Program lifecycle cron scheduled successfully", {
    interval: "Every 10 minutes",
  });
};
