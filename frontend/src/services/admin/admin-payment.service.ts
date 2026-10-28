import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_PAYMENT_ROUTES } from "@/routes/admin";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import type {
  AdminPaymentDTO,
  AdminPaymentQueryDTO,
  AdminPaymentCountQueryDTO,
} from "@/dtos/admin/payment/admin-payment.dto";

import type {
  AdminWalletDTO,
  AdminWalletQueryDTO,
} from "@/dtos/admin/payment/admin-wallet.dto";

import type { AdminWalletTransactionQueryDTO } from "@/dtos/admin/payment/admin-wallet-transaction.dto";

import type { AdminPaymentStatisticsDTO } from "@/dtos/admin/payment/admin-payment-statistics.dto";

import type {
  AdminPaymentListResponseDTO,
  AdminWalletListResponseDTO,
  AdminWalletTransactionListResponseDTO,
} from "@/dtos/admin/payment/admin-payment-response.dto";

export const adminPaymentService = {
  async getPayments(
    filters: AdminPaymentQueryDTO = {},
  ): Promise<ApiResponseDTO<AdminPaymentListResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminPaymentListResponseDTO>
    >(ADMIN_PAYMENT_ROUTES.LIST, { params: filters });

    return response.data;
  },

  async getPaymentById(
    paymentId: string,
  ): Promise<ApiResponseDTO<AdminPaymentDTO>> {
    const response = await clientApi.get<ApiResponseDTO<AdminPaymentDTO>>(
      ADMIN_PAYMENT_ROUTES.DETAILS(paymentId),
    );

    return response.data;
  },

  async getPaymentCount(
    filters: AdminPaymentCountQueryDTO = {},
  ): Promise<ApiResponseDTO<{ count: number }>> {
    const response = await clientApi.get<ApiResponseDTO<{ count: number }>>(
      ADMIN_PAYMENT_ROUTES.COUNT,
      { params: filters },
    );

    return response.data;
  },

  async getPaymentStatistics(): Promise<
    ApiResponseDTO<AdminPaymentStatisticsDTO>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<AdminPaymentStatisticsDTO>
    >(ADMIN_PAYMENT_ROUTES.STATISTICS);

    return response.data;
  },

  async getWallets(
    filters: AdminWalletQueryDTO = {},
  ): Promise<ApiResponseDTO<AdminWalletListResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminWalletListResponseDTO>
    >(ADMIN_PAYMENT_ROUTES.WALLETS, { params: filters });

    return response.data;
  },

  async getWalletById(
    walletId: string,
  ): Promise<ApiResponseDTO<AdminWalletDTO>> {
    const response = await clientApi.get<ApiResponseDTO<AdminWalletDTO>>(
      ADMIN_PAYMENT_ROUTES.WALLET_DETAILS(walletId),
    );

    return response.data;
  },

  async getWalletTransactions(
    walletId: string,
    filters: Omit<AdminWalletTransactionQueryDTO, "walletId"> = {},
  ): Promise<ApiResponseDTO<AdminWalletTransactionListResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminWalletTransactionListResponseDTO>
    >(ADMIN_PAYMENT_ROUTES.WALLET_TRANSACTIONS(walletId), {
      params: filters,
    });

    return response.data;
  },
};
