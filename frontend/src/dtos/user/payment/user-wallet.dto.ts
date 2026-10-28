export interface UserWalletDTO {
  id: string;
  availableBalance: number;
  escrowBalance: number;
  currency: string;
  lastTransactionAt: string | null;
  createdAt: string;
  updatedAt: string;
}