import type { Currency } from "../../../constants/common/currency.constants";

export class UserWalletResponseDTO {
  id!: string;
  availableBalance!: number;
  escrowBalance!: number;
  currency!: Currency;
  lastTransactionAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}