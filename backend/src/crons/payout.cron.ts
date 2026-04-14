import cron from "node-cron";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { UserPlanModel } from "../models/userPlan.model";
import { WalletModel } from "../models/wallet.model";
import { calculateCommission } from "../helper/paymentCalculator";
import logger from "../utils/logger";

export const startPayoutCron = () => {
  cron.schedule("0 0 * * *", async () => {
    logger.info("🟡 Payout cron started...");
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const expiredPlans = await UserPlanModel.find({
        status: "ACTIVE",
        endDate: { $lte: new Date() },
        isPayoutDone: false,
      }).session(session);

      if (expiredPlans.length === 0) {
        logger.info("No payouts to process");
        await session.commitTransaction();
        session.endSession();
        return;
      }
      logger.info(`Processing ${expiredPlans.length} payouts`);

      for (const plan of expiredPlans) {
        const adminWallet = await WalletModel.findOne({
          ownerType: "ADMIN",
        }).session(session);

        const nutritionistWallet = await WalletModel.findOne({
          ownerId: plan.nutritionistId,
          ownerType: "NUTRITIONIST",
        }).session(session);

        if (!adminWallet || !nutritionistWallet) {
          logger.error("Wallet not found", { planId: plan._id });
          continue;
        }

        const totalAmount = plan.amount;

        const { adminAmount, nutritionistAmount } =
          calculateCommission(totalAmount);

        if (adminWallet.escrowBalance < totalAmount) {
          logger.error("Insufficient escrow balance", {
            planId: plan._id,
          });
          continue;
        }

        await WalletModel.updateOne(
          { _id: adminWallet._id },
          {
            $inc: {
              escrowBalance: -adminAmount,
              balance: adminAmount,
            },
          },
          { session },
        );

        await WalletModel.updateOne(
          { _id: adminWallet._id },
          {
            $inc: {
              escrowBalance: -nutritionistAmount,
            },
          },
          { session },
        );

        await WalletModel.updateOne(
          { _id: nutritionistWallet._id },
          {
            $inc: {
              balance: nutritionistAmount,
            },
          },
          { session },
        );

        await UserPlanModel.updateOne(
          { _id: plan._id },
          {
            status: "EXPIRED",
            isPayoutDone: true,
          },
          { session },
        );

        logger.info("✅ Payout completed", {
          planId: plan._id.toString(),
        });
      }

      await session.commitTransaction();
      logger.info("🟢 Payout cron completed successfully");
    } catch (err) {
      await session.abortTransaction();
      logger.error("❌ Payout cron failed", err);
    } finally {
      session.endSession();
    }
  });
};
