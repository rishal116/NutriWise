import { INutriEarningsPaymentProjection } from "../../../types/nutritionist/earnings/nutri-earnings-payment.projection";
import { NutriEarningsPaymentDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-payment.dto";

export function toNutriEarningsPaymentDTO(
  payment: INutriEarningsPaymentProjection,
): NutriEarningsPaymentDTO {
  return {
    paymentId: payment.paymentId,
    resourceType: payment.resourceType,
    resourceId: payment.resourceId,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    provider: payment.provider,
    createdAt: payment.createdAt,
  };
}
