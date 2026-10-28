import type { IBaseRepository } from "../common/IBaseRepository";
import type { IPayment } from "../../../models/payment.model";
import type { IWallet } from "../../../models/wallet.model";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type {
  IAdminPaymentFilters,
  IAdminWalletFilters,
  IAdminWalletTransactionFilters,
  IAdminPaymentCountFilters,
  IAdminPaymentStatistics,
} from "../../../types/admin/payment/admin-payment.types";

export interface IAdminPaymentRepository extends IBaseRepository<IPayment> {
  findAll(
    filters: IAdminPaymentFilters,
  ): Promise<CursorPaginationResult<IPayment>>;

  findById(paymentId: string): Promise<IPayment | null>;

  count(filters: IAdminPaymentCountFilters): Promise<number>;

  findWallets(
    filters: IAdminWalletFilters,
  ): Promise<CursorPaginationResult<IWallet>>;

  findWalletById(walletId: string): Promise<IWallet | null>;

  findWalletTransactions(
    filters: IAdminWalletTransactionFilters,
  ): Promise<CursorPaginationResult<IWalletTransaction>>;

  getPaymentStatistics(): Promise<IAdminPaymentStatistics>;
}
