import mongoose from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import { CURRENCY } from "../../../../constants/common/currency.constants";
import logger from "../../../../utils/logger";

import type { IStripeCheckoutEventHandler } from "../../../interfaces/common/stripe/IStripeCheckoutEventHandler";
import type { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import type { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import type { IStripeCheckoutValidationService } from "../../../interfaces/common/stripe/IStripeCheckoutValidationService";
import type { IStripePaymentCalculationService } from "../../../interfaces/common/stripe/IStripePaymentCalculationService";
import type { IStripeProgramProvisioningService } from "../../../interfaces/common/stripe/IStripeProgramProvisioningService";

@injectable()
export class ProgramStripeCheckoutHandlerService implements IStripeCheckoutEventHandler {
  readonly paymentType = "nutritionist_plan" as const;

  constructor(
    @inject(TYPES.IStripeCheckoutValidationService)
    private readonly _validationService: IStripeCheckoutValidationService,

    @inject(TYPES.IStripePaymentCalculationService)
    private readonly _paymentCalculationService: IStripePaymentCalculationService,

    @inject(TYPES.IStripeProgramProvisioningService)
    private readonly _programProvisioningService: IStripeProgramProvisioningService,

    @inject(TYPES.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,

    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository,
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
    const checkoutData = await this._validationService.validate(session);

    const alreadyProcessed =
      await this._paymentRepository.existsByCheckoutSessionId(session.id);

    if (alreadyProcessed) {
      logger.warn("Duplicate Stripe checkout webhook ignored.", {
        checkoutSessionId: session.id,
      });
      return;
    }

    const calculation = this._paymentCalculationService.calculate(
      checkoutData.amountInPaise,
    );

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const duplicatePayment =
        await this._paymentRepository.existsByCheckoutSessionId(
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

      const provisioned = await this._programProvisioningService.provision({
        userId: checkoutData.userId,
        nutritionistId: checkoutData.nutritionistId,
        planId: checkoutData.planId,
        plan: checkoutData.plan,
        amount: calculation.amount,
        session: dbSession,
      });

      await this._paymentRepository.create(
        {
          buyerId: checkoutData.userId,
          sellerId: checkoutData.nutritionistId,
          itemType: "nutritionist_plan",
          itemId: checkoutData.planId,
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

      const adminWallet = await this._walletRepository.findOrCreate(
        checkoutData.adminId,
        "admin",
        dbSession,
      );

      await this._walletRepository.creditEscrow(
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
        commissionRate: this._paymentCalculationService.getCommissionRate(),
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
