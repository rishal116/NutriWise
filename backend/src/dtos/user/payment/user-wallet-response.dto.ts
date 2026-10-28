import type { Currency } from "../../../constants/currency.constants";

export class UserWalletResponseDTO {
  id!: string;
  availableBalance!: number;
  escrowBalance!: number;
  currency!: Currency;
  lastTransactionAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}