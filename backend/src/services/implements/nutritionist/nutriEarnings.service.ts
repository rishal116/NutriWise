import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { INutriEarningsService } from "../../interfaces/nutritionist/INutriEarningsService";
import { INutriEarningsRepository } from "../../../repositories/interfaces/nutritionist/INutriEarningsRepository";
import { GetNutriEarningsQueryDTO } from "../../../dtos/nutritionist/earnings/earnings-list-query.dto";
import { NutriEarningsSummaryDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-summary.dto";
import { NutriEarningsTransactionDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-transaction.dto";
import { NutriEarningsPaymentDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-payment.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { toNutriEarningsSummaryDTO } from "../../../mappers/nutritionist/earnings/nutri-earnings.mapper";
import { toNutriEarningsTransactionDTO } from "../../../mappers/nutritionist/earnings/nutri-earnings-transaction.mapper";
import { toNutriEarningsPaymentDTO } from "../../../mappers/nutritionist/earnings/nutri-earnings-payment.mapper";

@injectable()
export class NutriEarningsService implements INutriEarningsService {
  constructor(
    @inject(TYPES.INutriEarningsRepository)
    private readonly _earningsRepository: INutriEarningsRepository,
  ) {}

  async getSummary(nutritionistId: string): Promise<NutriEarningsSummaryDTO> {
    this.validateObjectId(nutritionistId);

    const wallet =
      await this._earningsRepository.findWalletByNutritionistId(nutritionistId);

    return toNutriEarningsSummaryDTO(wallet);
  }

  async getTransactions(
    nutritionistId: string,
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>> {
    this.validateObjectId(nutritionistId);

    const result = await this._earningsRepository.findTransactions(
      nutritionistId,
      query,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(toNutriEarningsTransactionDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPayments(
    nutritionistId: string,
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>> {
    this.validateObjectId(nutritionistId);

    const result = await this._earningsRepository.findPayments(
      nutritionistId,
      query,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(toNutriEarningsPaymentDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  private validateObjectId(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid nutritionist ID.");
    }

    return new Types.ObjectId(value);
  }
}
