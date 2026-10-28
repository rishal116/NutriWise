import { clientApi } from "@/lib/axios/clientApi";
import { USER_PAYMENT_ROUTES } from "@/routes/user";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { UserPaymentDTO } from "@/dtos/user/payment/user-payment.dto";
import type { UserWalletDTO } from "@/dtos/user/payment/user-wallet.dto";
import type { UserWalletTransactionDTO } from "@/dtos/user/payment/user-wallet-transaction.dto";

export const userPaymentService = {
  async getPayments(
    limit = 10,
    cursor?: string,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<UserPaymentDTO>>> {
    const res = await clientApi.get(USER_PAYMENT_ROUTES.PAYMENTS, {
      params: { limit, cursor },
    });

    return res.data;
  },

  async getPaymentById(
    paymentId: string,
  ): Promise<ApiResponseDTO<UserPaymentDTO | null>> {
    const res = await clientApi.get(
      USER_PAYMENT_ROUTES.PAYMENT_BY_ID(paymentId),
    );

    return res.data;
  },

  async getWallet(): Promise<ApiResponseDTO<UserWalletDTO | null>> {
    const res = await clientApi.get(USER_PAYMENT_ROUTES.WALLET);

    return res.data;
  },

  async getWalletTransactions(
    limit = 10,
    cursor?: string,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<UserWalletTransactionDTO>>
  > {
    const res = await clientApi.get(USER_PAYMENT_ROUTES.WALLET_TRANSACTIONS, {
      params: { limit, cursor },
    });

    return res.data;
  },
};
