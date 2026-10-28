import { FilterQuery, Types } from "mongoose";

import { PaymentModel, type IPayment } from "../../../models/payment.model";
import { WalletModel, type IWallet } from "../../../models/wallet.model";
import {
  WalletTransactionModel,
  type IWalletTransaction,
} from "../../../models/walletTransaction.model";
import type { IAdminPaymentRepository } from "../../interfaces/admin/IAdminPaymentRepository";
import { BaseRepository } from "../common/base.repository";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type {
  IAdminPaymentFilters,
  IAdminWalletFilters,
  IAdminWalletTransactionFilters,
  IAdminPaymentCountFilters,
  IAdminPaymentStatistics,
} from "../../../types/admin/payment/admin-payment.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

export class AdminPaymentRepository
  extends BaseRepository<IPayment>
  implements IAdminPaymentRepository
{
  async findAll(
    filters: IAdminPaymentFilters,
  ): Promise<CursorPaginationResult<IPayment>> {
    const { search, status, resourceType, cursor, limit } = filters;

    const query: FilterQuery<IPayment> = {};

    if (status) {
      query.status = status;
    }

    if (resourceType) {
      query.resourceType = resourceType;
    }

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        { checkoutSessionId: { $regex: escapedSearch, $options: "i" } },
        { paymentIntentId: { $regex: escapedSearch, $options: "i" } },
        { chargeId: { $regex: escapedSearch, $options: "i" } },
        { "itemSnapshot.title": { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const decodedCursor = decodeCursor(cursor);

    if (decodedCursor) {
      const cursorDate = new Date(decodedCursor.value);

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid payment cursor");
      }

      query.$or = [
        ...(query.$or ?? []),
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: new Types.ObjectId(decodedCursor.id) },
        },
      ];
    }

    const payments = await PaymentModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMore = payments.length > limit;
    const items = hasMore ? payments.slice(0, limit) : payments;
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt,
              id: lastItem._id.toString(),
            })
          : null,
      hasMore,
    };
  }

  async findById(paymentId: string): Promise<IPayment | null> {
    if (!Types.ObjectId.isValid(paymentId)) {
      return null;
    }

    return PaymentModel.findById(paymentId).lean().exec();
  }

  async count(filters: IAdminPaymentCountFilters): Promise<number> {
    const query: FilterQuery<IPayment> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.resourceType) {
      query.resourceType = filters.resourceType;
    }

    return PaymentModel.countDocuments(query).exec();
  }

  async findWallets(
    filters: IAdminWalletFilters,
  ): Promise<CursorPaginationResult<IWallet>> {
    const { search, ownerType, isActive, cursor, limit } = filters;

    const query: FilterQuery<IWallet> = {};

    if (ownerType) {
      query.ownerType = ownerType;
    }

    if (typeof isActive === "boolean") {
      query.isActive = isActive;
    }

    if (search?.trim() && Types.ObjectId.isValid(search.trim())) {
      query.ownerId = new Types.ObjectId(search.trim());
    } else if (search?.trim()) {
      return { items: [], nextCursor: null, hasMore: false };
    }

    const decodedCursor = decodeCursor(cursor);

    if (decodedCursor) {
      const cursorDate = new Date(decodedCursor.value);

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid wallet cursor");
      }

      query.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: new Types.ObjectId(decodedCursor.id) },
        },
      ];
    }

    const wallets = await WalletModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMore = wallets.length > limit;
    const items = hasMore ? wallets.slice(0, limit) : wallets;
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt,
              id: lastItem._id.toString(),
            })
          : null,
      hasMore,
    };
  }

  async findWalletById(walletId: string): Promise<IWallet | null> {
    if (!Types.ObjectId.isValid(walletId)) {
      return null;
    }

    return WalletModel.findById(walletId).lean().exec();
  }

  async findWalletTransactions(
    filters: IAdminWalletTransactionFilters,
  ): Promise<CursorPaginationResult<IWalletTransaction>> {
    const { walletId, type, reason, status, cursor, limit } = filters;

    if (!Types.ObjectId.isValid(walletId)) {
      return { items: [], nextCursor: null, hasMore: false };
    }

    const query: FilterQuery<IWalletTransaction> = {
      walletId: new Types.ObjectId(walletId),
    };

    if (type) {
      query.type = type;
    }

    if (reason) {
      query.reason = reason;
    }

    if (status) {
      query.status = status;
    }

    const decodedCursor = decodeCursor(cursor);

    if (decodedCursor) {
      const cursorDate = new Date(decodedCursor.value);

      if (Number.isNaN(cursorDate.getTime())) {
        throw new Error("Invalid transaction cursor");
      }

      query.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: new Types.ObjectId(decodedCursor.id) },
        },
      ];
    }

    const transactions = await WalletTransactionModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMore = transactions.length > limit;
    const items = hasMore ? transactions.slice(0, limit) : transactions;
    const lastItem = items.at(-1);

    return {
      items,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.createdAt,
              id: lastItem._id.toString(),
            })
          : null,
      hasMore,
    };
  }

  async getPaymentStatistics(): Promise<IAdminPaymentStatistics> {
    const [result] = await PaymentModel.aggregate<IAdminPaymentStatistics>([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          paidPayments: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          refundedPayments: {
            $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
          },
          totalCommission: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$commissionAmount", 0],
            },
          },
          totalRefunded: { $sum: "$refundedAmount" },
        },
      },
      { $project: { _id: 0 } },
    ]).exec();

    return (
      result ?? {
        totalPayments: 0,
        paidPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        refundedPayments: 0,
        totalRevenue: 0,
        totalCommission: 0,
        totalRefunded: 0,
      }
    );
  }
}
