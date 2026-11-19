import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import logger from "../../../../utils/logger";
import { TYPES } from "../../../../types/types";
import { CURRENCY } from "../../../../constants/common/currency.constants";
import type { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";
import type { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import type { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import { IStripeCheckoutValidationService } from "../../../interfaces/common/stripe/IStripeCheckoutValidationService";
import { IStripePaymentCalculationService } from "../../../interfaces/common/stripe/IStripePaymentCalculationService";
import { IStripeProgramProvisioningService } from "../../../interfaces/common/stripe/IStripeProgramProvisioningService";

@injectable()
export class StripeCheckoutHandlerService implements IStripeCheckoutHandlerService {
  constructor(
    @inject(TYPES.IStripeCheckoutValidationService)
    private readonly validationService: IStripeCheckoutValidationService,

    @inject(TYPES.IStripePaymentCalculationService)
    private readonly paymentCalculationService: IStripePaymentCalculationService,

    @inject(TYPES.IStripeProgramProvisioningService)
    private readonly programProvisioningService: IStripeProgramProvisioningService,

    @inject(TYPES.IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,

    @inject(TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
    const checkoutData = await this.validationService.validate(session);

    const alreadyProcessed =
      await this.paymentRepository.existsByCheckoutSessionId(session.id);

    if (alreadyProcessed) {
      logger.warn("Duplicate Stripe checkout webhook ignored.", {
        checkoutSessionId: session.id,
      });
      return;
    }

    const calculation = this.paymentCalculationService.calculate(
      checkoutData.amountInPaise,
    );

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const duplicatePayment =
        await this.paymentRepository.existsByCheckoutSessionId(
          session.id,
          dbSession,
        );

      if (duplicatePayment) {
        await dbSession.abortTransaction();

        logger.warn("Duplicate Stripe checkout webhook ignored.", {
          checkoutSessionId: session.id,
        });
        return;
      }

      const provisioned = await this.programProvisioningService.provision({
        userId: checkoutData.userId,
        nutritionistId: checkoutData.nutritionistId,
        planId: checkoutData.planId,
        plan: checkoutData.plan,
        amount: calculation.amount,
        session: dbSession,
      });

      await this.paymentRepository.create(
        {
          buyerId: new Types.ObjectId(checkoutData.userId),
          sellerId: new Types.ObjectId(checkoutData.nutritionistId),
          itemType: "nutritionist_plan",
          itemId: new Types.ObjectId(checkoutData.planId),
          provider: "stripe",
          status: "paid",
          amount: calculation.amount,
          currency: CURRENCY,
          providerReferences: {
            checkoutId: session.id,
            transactionId: checkoutData.paymentIntentId,
          },
          itemSnapshot: {
            title: checkoutData.plan.title,
          },
        },
        dbSession,
      );

      const adminWallet = await this.walletRepository.findOrCreate(
        checkoutData.adminId,
        "admin",
        dbSession,
      );

      await this.walletRepository.creditEscrow(
        adminWallet._id.toString(),
        calculation.amount,
        dbSession,
      );

      await dbSession.commitTransaction();

      logger.info("Stripe checkout processed successfully.", {
        checkoutSessionId: session.id,
        userPlanId: provisioned.userPlanId.toString(),
        userProgramId: provisioned.userProgramId.toString(),
        grossAmount: calculation.amount,
        commissionRate: this.paymentCalculationService.getCommissionRate(),
        commissionAmount: calculation.commissionAmount,
        nutritionistAmount: calculation.nutritionistAmount,
        currency: CURRENCY,
      });
    } catch (error) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      logger.error("Stripe checkout processing failed.", {
        checkoutSessionId: session.id,
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }
}
