import { injectable } from "inversify";
import { Types } from "mongoose";

import { PaymentModel } from "../../../../models/payment.model";
import { WalletModel } from "../../../../models/wallet.model";
import { WalletTransactionModel } from "../../../../models/walletTransaction.model";

import type { IUserPaymentRepository } from "../../../interfaces/user/account/IUserPaymentRepository";

import type {
  IUserPaymentProjection,
  IUserWalletProjection,
  IUserWalletTransactionProjection,
} from "../../../../types/user/payment/user-payment.projection";

import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { CursorData } from "../../../../types/cursor.types";

import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";

@injectable()
export class UserPaymentRepository implements IUserPaymentRepository {
  async getPayments(
    userId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IUserPaymentProjection>> {
    const decodedCursor: CursorData | null = decodeCursor(cursor);
    const cursorDate = decodedCursor ? new Date(decodedCursor.value) : null;

    if (cursorDate && !Number.isFinite(cursorDate.getTime())) {
      throw new Error("Invalid cursor");
    }

    const cursorId = decodedCursor && new Types.ObjectId(decodedCursor.id);

    const filter = {
      userId,
      ...(cursorDate &&
        cursorId && {
          $or: [
            { createdAt: { $lt: cursorDate } },
            {
              createdAt: cursorDate,
              _id: { $lt: cursorId },
            },
          ],
        }),
    };

    const results = await PaymentModel.find(filter)
      .select(
        "_id resourceType resourceId provider status amount commissionAmount currency itemSnapshot refundedAmount refundReason createdAt updatedAt",
      )
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IUserPaymentProjection[]>()
      .exec();

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    const lastItem = items.at(-1);

    return {
      items,
      hasMore,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt.toISOString(),
              id: lastItem._id.toString(),
            })
          : null,
    };
  }

  async getPaymentById(
    userId: Types.ObjectId,
    paymentId: Types.ObjectId,
  ): Promise<IUserPaymentProjection | null> {
    return PaymentModel.findOne({
      _id: paymentId,
      userId,
    })
      .select(
        "_id resourceType resourceId provider status amount commissionAmount currency itemSnapshot refundedAmount refundReason createdAt updatedAt",
      )
      .lean<IUserPaymentProjection>()
      .exec();
  }

  async getWallet(
    userId: Types.ObjectId,
  ): Promise<IUserWalletProjection | null> {
    return WalletModel.findOne({
      ownerId: userId,
      ownerType: "user",
      isActive: true,
    })
      .select(
        "_id ownerId ownerType availableBalance escrowBalance currency isActive lastTransactionAt createdAt updatedAt",
      )
      .lean<IUserWalletProjection>()
      .exec();
  }

  async getWalletTransactions(
    userId: Types.ObjectId,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IUserWalletTransactionProjection>> {
    const wallet = await WalletModel.findOne({
      ownerId: userId,
      ownerType: "user",
      isActive: true,
    })
      .select("_id")
      .lean<{ _id: Types.ObjectId }>()
      .exec();

    if (!wallet) {
      return {
        items: [],
        hasMore: false,
        nextCursor: null,
      };
    }

    const decodedCursor: CursorData | null = decodeCursor(cursor);
    const cursorDate = decodedCursor ? new Date(decodedCursor.value) : null;

    if (cursorDate && !Number.isFinite(cursorDate.getTime())) {
      throw new Error("Invalid cursor");
    }

    const cursorId = decodedCursor && new Types.ObjectId(decodedCursor.id);

    const filter = {
      walletId: wallet._id,
      ...(cursorDate &&
        cursorId && {
          $or: [
            { createdAt: { $lt: cursorDate } },
            {
              createdAt: cursorDate,
              _id: { $lt: cursorId },
            },
          ],
        }),
    };

    const results = await WalletTransactionModel.find(filter)
      .select(
        "_id amount type reason balanceBefore balanceAfter referenceId status createdAt",
      )
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IUserWalletTransactionProjection[]>()
      .exec();

    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    const lastItem = items.at(-1);

    return {
      items,
      hasMore,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt.toISOString(),
              id: lastItem._id.toString(),
            })
          : null,
    };
  }
}
