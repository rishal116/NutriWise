export interface AdminPaymentListResponseDTO {
  items: import("./admin-payment.dto").AdminPaymentDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AdminWalletListResponseDTO {
  items: import("./admin-wallet.dto").AdminWalletDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AdminWalletTransactionListResponseDTO {
  items: import("./admin-wallet-transaction.dto").AdminWalletTransactionDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}