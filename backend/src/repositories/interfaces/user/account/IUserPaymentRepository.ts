import type { Types } from "mongoose";

import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type {
  IUserPaymentProjection,
  IUserWalletProjection,
  IUserWalletTransactionProjection,
} from "../../../../types/user/payment/user-payment.projection";

export interface IUserPaymentRepository {
  getPayments(
    userId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IUserPaymentProjection>>;

  getPaymentById(
    userId: Types.ObjectId,
    paymentId: Types.ObjectId,
  ): Promise<IUserPaymentProjection | null>;

  getWallet(userId: Types.ObjectId): Promise<IUserWalletProjection | null>;

  getWalletTransactions(
    userId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IUserWalletTransactionProjection>>;
}
