import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import type {
  PaymentStatus,
  PaymentResourceType,
} from "../../../models/payment.model";
import type { WalletOwnerType } from "../../../models/wallet.model";
import type { IWalletTransaction } from "../../../models/walletTransaction.model";

export class AdminPaymentQueryDTO {
  @IsOptional()
  @IsEnum(["pending", "paid", "failed", "refunded"])
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum([
    "nutritionist_plan",
    "consultation_session",
    "session_registration",
  ])
  resourceType?: PaymentResourceType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class AdminWalletQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(["admin", "nutritionist", "user"])
  ownerType?: WalletOwnerType;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class AdminWalletTransactionQueryDTO {
  @IsMongoId()
  walletId!: string;

  @IsOptional()
  @IsEnum(["credit", "debit"])
  type?: IWalletTransaction["type"];

  @IsOptional()
  @IsEnum(["plan_purchase", "refund", "withdrawal", "top_up"])
  reason?: IWalletTransaction["reason"];

  @IsOptional()
  @IsEnum(["pending", "success", "failed"])
  status?: IWalletTransaction["status"];

  @IsOptional()
  @IsString()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class AdminPaymentCountQueryDTO {
  @IsOptional()
  @IsEnum(["pending", "paid", "failed", "refunded"])
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum([
    "nutritionist_plan",
    "consultation_session",
    "session_registration",
  ])
  resourceType?: PaymentResourceType;
}