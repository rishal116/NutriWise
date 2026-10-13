import { Types } from "mongoose";
import { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import { IWallet } from "../../../models/wallet.model";
import { GetNutriEarningsQueryDTO } from "../../../dtos/nutritionist/earnings/earnings-list-query.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { INutriEarningsTransactionProjection } from "../../../types/nutritionist/earnings/nutri-earnings-transaction.projection";
import { INutriEarningsPaymentProjection } from "../../../types/nutritionist/earnings/nutri-earnings-payment.projection";

export interface INutriEarningsRepository extends IBaseRepository<IWallet> {
  findWalletByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IWallet | null>;

  findTransactions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriEarningsQueryDTO,
  ): Promise<CursorPaginationResult<INutriEarningsTransactionProjection>>;

  findPayments(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriEarningsQueryDTO,
  ): Promise<CursorPaginationResult<INutriEarningsPaymentProjection>>;
}
