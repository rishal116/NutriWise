
import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_EARNINGS_ROUTES } from "@/routes/nutritionist/earnings.routes";

import type { NutriEarningsSummaryDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-summary.dto";
import type { NutriEarningsTransactionDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-transaction.dto";
import type { NutriEarningsPaymentDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-payment.dto";
import type { GetNutriEarningsQueryDTO } from "@/dtos/nutritionist/earnings/earnings-list-query.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriEarningsService = {
  async getSummary(): Promise<NutriEarningsSummaryDTO> {
    const { data } = await clientApi.get<
      ApiResponseDTO<NutriEarningsSummaryDTO>
    >(NUTRITIONIST_EARNINGS_ROUTES.SUMMARY);

    if (!data.data) {
      throw new Error("Earnings summary not found.");
    }

    return data.data;
  },

  async getTransactions(
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>> {
    const { data } = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>>
    >(NUTRITIONIST_EARNINGS_ROUTES.TRANSACTIONS, {
      params: query,
    });

    if (!data.data) {
      throw new Error("Earnings transactions not found.");
    }

    return data.data;
  },

  async getPayments(
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>> {
    const { data } = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>>
    >(NUTRITIONIST_EARNINGS_ROUTES.PAYMENTS, {
      params: query,
    });

    if (!data.data) {
      throw new Error("Earnings payments not found.");
    }

    return data.data;
  },
};
