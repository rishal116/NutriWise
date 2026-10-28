import type {
  PaymentStatus,
  PaymentResourceType,
} from "../../../models/payment.model";
import type { WalletOwnerType } from "../../../models/wallet.model";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";
import type { CursorData } from "../../cursor.types";

export interface IAdminPaymentFilters {
  search?: string;
  status?: PaymentStatus;
  resourceType?: PaymentResourceType;
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
  resourceType?: PaymentResourceType;
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
