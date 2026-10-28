import type { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import type { UserPaymentResponseDTO } from "../../../../dtos/user/payment/user-payment-response.dto";
import type { UserWalletResponseDTO } from "../../../../dtos/user/payment/user-wallet-response.dto";
import type { UserWalletTransactionResponseDTO } from "../../../../dtos/user/payment/user-wallet-transaction-response.dto";

export interface IUserPaymentService {
  getPayments(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<UserPaymentResponseDTO>>;

  getPaymentById(
    userId: string,
    paymentId: string,
  ): Promise<UserPaymentResponseDTO | null>;

  getWallet(userId: string): Promise<UserWalletResponseDTO | null>;

  getWalletTransactions(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<UserWalletTransactionResponseDTO>>;
}
