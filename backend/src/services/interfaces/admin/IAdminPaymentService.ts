import type {
  AdminPaymentQueryDTO,
  AdminWalletQueryDTO,
  AdminWalletTransactionQueryDTO,
  AdminPaymentCountQueryDTO,
} from "../../../dtos/admin/payment/admin-payment.dto";

import type {
  AdminPaymentListResponseDTO,
  AdminWalletListResponseDTO,
  AdminWalletTransactionListResponseDTO,
  AdminPaymentStatisticsResponseDTO,
} from "../../../dtos/admin/payment/admin-payment-response.dto";

import type { IPayment } from "../../../models/payment.model";
import type { IWallet } from "../../../models/wallet.model";

export interface IAdminPaymentService {
  getPayments(
    filters: AdminPaymentQueryDTO,
  ): Promise<AdminPaymentListResponseDTO>;

  getPaymentById(paymentId: string): Promise<IPayment>;

  getPaymentCount(filters: AdminPaymentCountQueryDTO): Promise<number>;

  getWallets(filters: AdminWalletQueryDTO): Promise<AdminWalletListResponseDTO>;

  getWalletById(walletId: string): Promise<IWallet>;

  getWalletTransactions(
    filters: AdminWalletTransactionQueryDTO,
  ): Promise<AdminWalletTransactionListResponseDTO>;

  getPaymentStatistics(): Promise<AdminPaymentStatisticsResponseDTO>;
}
