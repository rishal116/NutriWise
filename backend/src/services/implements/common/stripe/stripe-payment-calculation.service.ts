import { injectable } from "inversify";

import type { StripePaymentCalculationDTO } from "../../../../dtos/common/stripe/stripe-payment-calculation.dto";
import type { IStripePaymentCalculationService } from "../../../interfaces/common/stripe/IStripePaymentCalculationService";

const COMMISSION_RATE = 10;

@injectable()
export class StripePaymentCalculationService implements IStripePaymentCalculationService {
  calculate(amountInPaise: number): StripePaymentCalculationDTO {
    const commissionInPaise = Math.round(
      (amountInPaise * COMMISSION_RATE) / 100,
    );

    const nutritionistAmountInPaise = amountInPaise - commissionInPaise;

    return {
      amountInPaise,
      commissionInPaise,
      nutritionistAmountInPaise,
      amount: amountInPaise / 100,
      commissionAmount: commissionInPaise / 100,
      nutritionistAmount: nutritionistAmountInPaise / 100,
    };
  }

  getCommissionRate(): number {
    return COMMISSION_RATE;
  }
}
