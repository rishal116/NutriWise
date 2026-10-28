import type { IPayment } from "../../../models/payment.model";
import type { IWallet } from "../../../models/wallet.model";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";
import type { IAdminPaymentStatistics } from "../../../types/admin/payment/admin-payment.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export class AdminPaymentListResponseDTO implements CursorPaginationResult<IPayment> {
  items: IPayment[];
  nextCursor: string | null;
  hasMore: boolean;

  constructor(result: CursorPaginationResult<IPayment>) {
    this.items = result.items;
    this.nextCursor = result.nextCursor;
    this.hasMore = result.hasMore;
  }
}

export class AdminWalletListResponseDTO implements CursorPaginationResult<IWallet> {
  items: IWallet[];
  nextCursor: string | null;
  hasMore: boolean;

  constructor(result: CursorPaginationResult<IWallet>) {
    this.items = result.items;
    this.nextCursor = result.nextCursor;
    this.hasMore = result.hasMore;
  }
}

export class AdminWalletTransactionListResponseDTO implements CursorPaginationResult<IWalletTransaction> {
  items: IWalletTransaction[];
  nextCursor: string | null;
  hasMore: boolean;

  constructor(result: CursorPaginationResult<IWalletTransaction>) {
    this.items = result.items;
    this.nextCursor = result.nextCursor;
    this.hasMore = result.hasMore;
  }
}

export class AdminPaymentStatisticsResponseDTO implements IAdminPaymentStatistics {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  totalCommission: number;
  totalRefunded: number;

  constructor(data: IAdminPaymentStatistics) {
    Object.assign(this, data);
    this.totalPayments = data.totalPayments;
    this.paidPayments = data.paidPayments;
    this.pendingPayments = data.pendingPayments;
    this.failedPayments = data.failedPayments;
    this.refundedPayments = data.refundedPayments;
    this.totalRevenue = data.totalRevenue;
    this.totalCommission = data.totalCommission;
    this.totalRefunded = data.totalRefunded;
  }
}
