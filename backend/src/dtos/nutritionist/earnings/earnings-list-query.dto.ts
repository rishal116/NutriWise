import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import {
  WALLET_TRANSACTION_REASONS,
  WALLET_TRANSACTION_TYPES,
  WALLET_TXN_STATUSES,
} from "../../../models/walletTransaction.model";
import { PAYMENT_ITEM_TYPES, PAYMENT_STATUSES, PaymentItemType } from "../../../constants/common/payment.constants";


export class GetNutriEarningsQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsIn(WALLET_TRANSACTION_TYPES)
  transactionType?: (typeof WALLET_TRANSACTION_TYPES)[number];

  @IsOptional()
  @IsIn(WALLET_TRANSACTION_REASONS)
  reason?: (typeof WALLET_TRANSACTION_REASONS)[number];

  @IsOptional()
  @IsIn(WALLET_TXN_STATUSES)
  transactionStatus?: (typeof WALLET_TXN_STATUSES)[number];

  @IsOptional()
  @IsIn(PAYMENT_ITEM_TYPES)
  resourceType?: PaymentItemType;

  @IsOptional()
  @IsIn(PAYMENT_ITEM_TYPES)
  itemType?: PaymentItemType;

  @IsOptional()
  @IsIn(PAYMENT_STATUSES)
  paymentStatus?: (typeof PAYMENT_STATUSES)[number];
}
