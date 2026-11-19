import type {
  PaymentItemType,
  PaymentProvider,
  PaymentStatus,
} from "../../../models/payment.model";
import type { Currency } from "../../../constants/common/currency.constants";

export class UserPaymentResponseDTO {
  id!: string;
  resourceType!: PaymentItemType;
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
