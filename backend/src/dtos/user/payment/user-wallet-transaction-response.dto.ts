import type {
  WalletTransactionReason,
  WalletTransactionType,
  WalletTxnStatus,
} from "../../../models/walletTransaction.model";

export class UserWalletTransactionResponseDTO {
  id!: string;
  amount!: number;
  type!: WalletTransactionType;
  reason!: WalletTransactionReason;
  balanceBefore!: number;
  balanceAfter!: number;
  referenceId!: string;
  status!: WalletTxnStatus;
  createdAt!: Date;
}