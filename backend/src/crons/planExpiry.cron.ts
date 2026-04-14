import cron from "node-cron";
import mongoose from "mongoose";
import { UserPlanModel } from "../models/userPlan.model";
import logger from "../utils/logger";

export const startPlanExpiryCron = () => {
  cron.schedule("0 * * * *", async () => {
    logger.info("⏳ Running Plan Expiry Cron...");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const now = new Date();

      const expiredPlans = await UserPlanModel.updateMany(
        {
          status: "ACTIVE",
          endDate: { $lte: now },
        },
        {
          $set: {
            status: "EXPIRED",
          },
        },
        { session },
      );

      logger.info(`✅ Expired Plans Count: ${expiredPlans.modifiedCount}`);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      logger.error("❌ Plan Expiry Cron Failed", err);
    } finally {
      session.endSession();
    }
  });
};
