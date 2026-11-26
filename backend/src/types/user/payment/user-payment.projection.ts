import type { Types } from "mongoose";
import type {
  WalletTransactionReason,
  WalletTransactionType,
  WalletTxnStatus,
} from "../../../models/walletTransaction.model";
import type { Currency } from "../../../constants/common/currency.constants";
import { PaymentItemType, PaymentProvider, PaymentStatus } from "../../../constants/common/payment.constants";
import { WalletOwnerType } from "../../../constants/common/wallet.constants";

export interface IUserPaymentProjection {
  _id: Types.ObjectId;
  resourceType?: PaymentItemType;
  itemType?: PaymentItemType;
  resourceId?: Types.ObjectId;
  itemId?: Types.ObjectId;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  commissionAmount: number;
  currency: Currency;
  itemSnapshot: {
    title: string;
    price: number;
    currency: Currency;
  };
  refundedAmount: number;
  refundReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWalletProjection {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  ownerType: WalletOwnerType;
  availableBalance: number;
  escrowBalance: number;
  currency: Currency;
  isActive: boolean;
  lastTransactionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWalletTransactionProjection {
  _id: Types.ObjectId;
  amount: number;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string;
  status: WalletTxnStatus;
  createdAt: Date;
}

export interface IUserPaymentCursor {
  createdAt: Date;
  id: Types.ObjectId;
}

export interface IUserWalletTransactionCursor {
  createdAt: Date;
  id: Types.ObjectId;
}

export interface IUserPaymentPaginationResult {
  items: IUserPaymentProjection[];
  nextCursor: IUserPaymentCursor | null;
  hasMore: boolean;
}

export interface IUserWalletTransactionPaginationResult {
  items: IUserWalletTransactionProjection[];
  nextCursor: IUserWalletTransactionCursor | null;
  hasMore: boolean;
}
