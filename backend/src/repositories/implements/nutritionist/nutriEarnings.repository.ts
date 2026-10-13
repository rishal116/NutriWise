import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { WalletModel, IWallet } from "../../../models/wallet.model";
import { WalletTransactionModel } from "../../../models/walletTransaction.model";
import { PaymentModel } from "../../../models/payment.model";
import { BaseRepository } from "../../implements/common/base.repository";
import { INutriEarningsRepository } from "../../interfaces/nutritionist/INutriEarningsRepository";
import { GetNutriEarningsQueryDTO } from "../../../dtos/nutritionist/earnings/earnings-list-query.dto";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  INutriEarningsTransactionProjection,
  INutriEarningsTransactionProjectionWithCursor,
} from "../../../types/nutritionist/earnings/nutri-earnings-transaction.projection";
import {
  INutriEarningsPaymentProjection,
  INutriEarningsPaymentProjectionWithCursor,
} from "../../../types/nutritionist/earnings/nutri-earnings-payment.projection";

@injectable()
export class NutriEarningsRepository
  extends BaseRepository<IWallet>
  implements INutriEarningsRepository
{
  constructor() {
    super(WalletModel);
  }

  async findWalletByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IWallet | null> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    return WalletModel.findOne({
      ownerId: nutritionistObjectId,
      ownerType: "nutritionist",
    }).exec();
  }

  async findTransactions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriEarningsQueryDTO,
  ): Promise<CursorPaginationResult<INutriEarningsTransactionProjection>> {
    const {
      cursor,
      limit = 10,
      transactionType,
      reason,
      transactionStatus,
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const wallet = await WalletModel.findOne({
      ownerId: nutritionistObjectId,
      ownerType: "nutritionist",
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (!wallet) {
      return { items: [], nextCursor: null, hasMore: false };
    }

    const cursorData = cursor ? decodeCursor(cursor) : null;
    const pipeline: PipelineStage[] = [
      {
        $match: {
          walletId: wallet._id,
          ...(transactionType ? { type: transactionType } : {}),
          ...(reason ? { reason } : {}),
          ...(transactionStatus ? { status: transactionStatus } : {}),
        },
      },
    ];

    if (cursorData) {
      const cursorDate = new Date(cursorData.value);

      pipeline.push({
        $match: {
          $or: [
            { createdAt: { $lt: cursorDate } },
            {
              createdAt: cursorDate,
              _id: { $lt: new Types.ObjectId(cursorData.id) },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          transactionId: "$_id",
          amount: 1,
          type: 1,
          reason: 1,
          balanceBefore: 1,
          balanceAfter: 1,
          referenceId: 1,
          status: 1,
          createdAt: 1,
          cursorId: "$_id",
          cursorValue: "$createdAt",
        },
      },
    );

    const result =
      await WalletTransactionModel.aggregate<INutriEarningsTransactionProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }

  async findPayments(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriEarningsQueryDTO,
  ): Promise<CursorPaginationResult<INutriEarningsPaymentProjection>> {
    const { cursor, limit = 10, resourceType, paymentStatus } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const cursorData = cursor ? decodeCursor(cursor) : null;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          sellerId: nutritionistObjectId,
          ...(resourceType ? { resourceType } : {}),
          ...(paymentStatus
            ? { status: paymentStatus }
            : { status: { $in: ["paid", "refunded", "partially_refunded"] } }),
        },
      },
    ];

    if (cursorData) {
      const cursorDate = new Date(cursorData.value);

      pipeline.push({
        $match: {
          $or: [
            { createdAt: { $lt: cursorDate } },
            {
              createdAt: cursorDate,
              _id: { $lt: new Types.ObjectId(cursorData.id) },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          paymentId: "$_id",
          resourceType: 1,
          resourceId: 1,
          status: 1,
          amount: 1,
          currency: 1,
          provider: 1,
          createdAt: 1,
          cursorId: "$_id",
          cursorValue: "$createdAt",
        },
      },
    );

    const result =
      await PaymentModel.aggregate<INutriEarningsPaymentProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }
}
