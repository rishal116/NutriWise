export type WalletOwnerType = "admin" | "nutritionist" | "user";

export interface AdminWalletDTO {
  _id: string;
  ownerId: string;
  ownerType: WalletOwnerType;
  availableBalance: number;
  escrowBalance: number;
  currency: string;
  isActive: boolean;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminWalletQueryDTO {
  search?: string;
  ownerType?: WalletOwnerType;
  isActive?: boolean;
  cursor?: string;
  limit?: number;
}