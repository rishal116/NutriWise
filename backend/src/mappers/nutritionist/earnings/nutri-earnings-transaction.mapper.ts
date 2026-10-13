import { INutriEarningsTransactionProjection } from "../../../types/nutritionist/earnings/nutri-earnings-transaction.projection";
import { NutriEarningsTransactionDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-transaction.dto";

export function toNutriEarningsTransactionDTO(
  transaction: INutriEarningsTransactionProjection,
): NutriEarningsTransactionDTO {
  return {
    transactionId: transaction.transactionId,
    amount: transaction.amount,
    type: transaction.type,
    reason: transaction.reason,
    balanceBefore: transaction.balanceBefore,
    balanceAfter: transaction.balanceAfter,
    referenceId: transaction.referenceId,
    status: transaction.status,
    createdAt: transaction.createdAt,
  };
}
