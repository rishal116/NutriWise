import type { IPayment } from "../../../models/payment.model";
import type { IWallet } from "../../../models/wallet.model";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";
import type { IAdminPaymentStatistics } from "../../../types/admin/payment/admin-payment.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  AdminPaymentListResponseDTO,
  AdminWalletListResponseDTO,
  AdminWalletTransactionListResponseDTO,
  AdminPaymentStatisticsResponseDTO,
} from "../../../dtos/admin/payment/admin-payment-response.dto";

export class AdminPaymentMapper {
  static toPaymentListDTO(
    result: CursorPaginationResult<IPayment>,
  ): AdminPaymentListResponseDTO {
    return new AdminPaymentListResponseDTO(result);
  }

  static toWalletListDTO(
    result: CursorPaginationResult<IWallet>,
  ): AdminWalletListResponseDTO {
    return new AdminWalletListResponseDTO(result);
  }

  static toWalletTransactionListDTO(
    result: CursorPaginationResult<IWalletTransaction>,
  ): AdminWalletTransactionListResponseDTO {
    return new AdminWalletTransactionListResponseDTO(result);
  }

  static toPaymentStatisticsDTO(
    statistics: IAdminPaymentStatistics,
  ): AdminPaymentStatisticsResponseDTO {
    return new AdminPaymentStatisticsResponseDTO(statistics);
  }

  static toPaymentDTO(payment: IPayment): IPayment {
    return payment;
  }

  static toWalletDTO(wallet: IWallet): IWallet {
    return wallet;
  }
}
