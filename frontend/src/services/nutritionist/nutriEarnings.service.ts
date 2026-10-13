import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_EARNINGS_ROUTES } from "@/routes/nutritionist/earnings.routes";
import type { NutriEarningsSummaryDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-summary.dto";
import type { NutriEarningsTransactionDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-transaction.dto";
import type { NutriEarningsPaymentDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-payment.dto";
import type { GetNutriEarningsQueryDTO } from "@/dtos/nutritionist/earnings/earnings-list-query.dto";
import type { ApiResponse } from "@/types/api/apiResponse";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriEarningsService = {
  async getSummary(): Promise<NutriEarningsSummaryDTO> {
    const res = await clientApi.get<ApiResponse<NutriEarningsSummaryDTO>>(
      NUTRITIONIST_EARNINGS_ROUTES.SUMMARY,
    );

    return res.data.data;
  },

  async getTransactions(
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>> {
    const res = await clientApi.get<
      ApiResponse<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>>
    >(NUTRITIONIST_EARNINGS_ROUTES.TRANSACTIONS, {
      params: query,
    });

    return res.data.data;
  },

  async getPayments(
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>> {
    const res = await clientApi.get<
      ApiResponse<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>>
    >(NUTRITIONIST_EARNINGS_ROUTES.PAYMENTS, {
      params: query,
    });

    return res.data.data;
  },
};
