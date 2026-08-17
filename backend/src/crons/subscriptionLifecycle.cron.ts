import cron from "node-cron";

import { UserPlanModel } from "../models/userPlan.model";
import logger from "../utils/logger";

const activateSubscriptions = async (): Promise<void> => {
  const now = new Date();

  const result = await UserPlanModel.updateMany(
    {
      paymentStatus: "paid",
      subscriptionStatus: "pending",
      startDate: {
        $ne: null,
        $lte: now,
      },
      endDate: {
        $ne: null,
        $gt: now,
      },
    },
    {
      $set: {
        subscriptionStatus: "active",
      },
    },
  );

  if (result.modifiedCount > 0) {
    logger.info("Subscriptions activated", {
      count: result.modifiedCount,
    });
  }
};

const expireSubscriptions = async (): Promise<void> => {
  const now = new Date();

  const result = await UserPlanModel.updateMany(
    {
      subscriptionStatus: "active",
      endDate: {
        $ne: null,
        $lte: now,
      },
    },
    {
      $set: {
        subscriptionStatus: "expired",
      },
    },
  );

  if (result.modifiedCount > 0) {
    logger.info("Subscriptions expired", {
      count: result.modifiedCount,
    });
  }
};

export const runSubscriptionLifecycle = async (): Promise<void> => {
  try {
    await activateSubscriptions();
    await expireSubscriptions();
  } catch (error) {
    logger.error("Subscription lifecycle processing failed", {
      error,
    });
  }
};

export const startSubscriptionLifecycleCron = (): void => {
  cron.schedule("0 * * * *", async () => {
    await runSubscriptionLifecycle();
  });

  logger.info("Subscription lifecycle cron started");
};
