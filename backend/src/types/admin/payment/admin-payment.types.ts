
import { PaymentStatus } from "../../../constants/common/payment.constants";
import { WalletOwnerType } from "../../../constants/common/wallet.constants";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";
import type { CursorData } from "../../cursor.types";

export interface IAdminPaymentFilters {
  search?: string;
  status?: PaymentStatus;
  cursor?: string;
  limit: number;
}

export interface IAdminWalletFilters {
  search?: string;
  ownerType?: WalletOwnerType;
  isActive?: boolean;
  cursor?: string;
  limit: number;
}

export interface IAdminWalletTransactionFilters {
  walletId: string;
  type?: IWalletTransaction["type"];
  reason?: IWalletTransaction["reason"];
  status?: IWalletTransaction["status"];
  cursor?: string;
  limit: number;
}

export interface IAdminPaymentCountFilters {
  status?: PaymentStatus;
}

export interface IAdminPaymentStatistics {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  totalCommission: number;
  totalRefunded: number;
}

export type AdminCursorData = CursorData;
