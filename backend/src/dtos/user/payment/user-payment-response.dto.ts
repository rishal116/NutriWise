import type {
  PaymentProvider,
  PaymentResourceType,
  PaymentStatus,
} from "../../../models/payment.model";
import type { Currency } from "../../../constants/currency.constants";

export class UserPaymentResponseDTO {
  id!: string;
  resourceType!: PaymentResourceType;
  resourceId!: string;
  provider!: PaymentProvider;
  status!: PaymentStatus;
  amount!: number;
  commissionAmount!: number;
  currency!: Currency;
  itemSnapshot!: {
    title: string;
    price: number;
    currency: Currency;
  };
  refundedAmount!: number;
  refundReason!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}