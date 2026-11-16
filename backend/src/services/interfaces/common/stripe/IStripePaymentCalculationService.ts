import type { StripePaymentCalculationDTO } from "../../../../dtos/common/stripe/stripe-payment-calculation.dto";

export interface IStripePaymentCalculationService {
  calculate(amountInPaise: number): StripePaymentCalculationDTO;
  getCommissionRate(): number;
}
