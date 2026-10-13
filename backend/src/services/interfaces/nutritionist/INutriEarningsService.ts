import { GetNutriEarningsQueryDTO } from "../../../dtos/nutritionist/earnings/earnings-list-query.dto";
import { NutriEarningsSummaryDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-summary.dto";
import { NutriEarningsTransactionDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-transaction.dto";
import { NutriEarningsPaymentDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-payment.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutriEarningsService {
  getSummary(nutritionistId: string): Promise<NutriEarningsSummaryDTO>;

  getTransactions(
    nutritionistId: string,
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsTransactionDTO>>;

  getPayments(
    nutritionistId: string,
    query: GetNutriEarningsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriEarningsPaymentDTO>>;
}
