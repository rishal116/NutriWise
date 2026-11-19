import { INutriEarningsPaymentProjection } from "../../../types/nutritionist/earnings/nutri-earnings-payment.projection";
import { NutriEarningsPaymentDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-payment.dto";

export function toNutriEarningsPaymentDTO(
  payment: INutriEarningsPaymentProjection,
): NutriEarningsPaymentDTO {
  return {
    paymentId: payment.paymentId,
    itemType: payment.itemType ?? payment.resourceType,
    resourceType: payment.resourceType ?? payment.itemType,
    itemId: payment.itemId ?? payment.resourceId,
    resourceId: payment.resourceId ?? payment.itemId,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    provider: payment.provider,
    createdAt: payment.createdAt,
  };
}
