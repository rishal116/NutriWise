import type {
  IUserPaymentProjection,
  IUserWalletProjection,
  IUserWalletTransactionProjection,
} from "../../../types/user/payment/user-payment.projection";

import { UserPaymentResponseDTO } from "../../../dtos/user/payment/user-payment-response.dto";
import { UserWalletResponseDTO } from "../../../dtos/user/payment/user-wallet-response.dto";
import { UserWalletTransactionResponseDTO } from "../../../dtos/user/payment/user-wallet-transaction-response.dto";

export class UserPaymentMapper {
  static toPaymentResponseDTO(
    payment: IUserPaymentProjection,
  ): UserPaymentResponseDTO {
    return {
      id: payment._id.toString(),
      resourceType: payment.resourceType,
      resourceId: payment.resourceId.toString(),
      provider: payment.provider,
      status: payment.status,
      amount: payment.amount,
      commissionAmount: payment.commissionAmount,
      currency: payment.currency,
      itemSnapshot: {
        title: payment.itemSnapshot.title,
        price: payment.itemSnapshot.price,
        currency: payment.itemSnapshot.currency,
      },
      refundedAmount: payment.refundedAmount,
      refundReason: payment.refundReason,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  static toWalletResponseDTO(
    wallet: IUserWalletProjection,
  ): UserWalletResponseDTO {
    return {
      id: wallet._id.toString(),
      availableBalance: wallet.availableBalance,
      escrowBalance: wallet.escrowBalance,
      currency: wallet.currency,
      lastTransactionAt: wallet.lastTransactionAt,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  static toWalletTransactionResponseDTO(
    transaction: IUserWalletTransactionProjection,
  ): UserWalletTransactionResponseDTO {
    return {
      id: transaction._id.toString(),
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
}