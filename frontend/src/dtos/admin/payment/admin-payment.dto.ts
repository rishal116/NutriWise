import type {
  PaymentResourceType,
  PaymentStatus,
} from "../../../types/payment.types";

export interface AdminPaymentDTO {
  _id: string;
  userId: string;
  sellerId?: string;
  resourceType: PaymentResourceType;
  provider: "stripe";
  status: PaymentStatus;
  amount: number;
  commissionAmount: number;
  currency: string;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  chargeId?: string;
  itemSnapshot: {
    title: string;
    price: number;
    currency: string;
  };
  refundedAmount: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentQueryDTO {
  search?: string;
  status?: PaymentStatus;
  resourceType?: PaymentResourceType;
  cursor?: string;
  limit?: number;
}

export interface AdminPaymentCountQueryDTO {
  status?: PaymentStatus;
  resourceType?: PaymentResourceType;
}