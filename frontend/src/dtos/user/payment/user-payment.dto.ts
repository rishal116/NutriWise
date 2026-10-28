export type UserPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type UserPaymentProvider = "stripe";

export type UserPaymentResourceType =
  "nutritionist_plan" | "consultation_session" | "session_registration";

export interface UserPaymentDTO {
  id: string;
  resourceType: UserPaymentResourceType;
  resourceId: string;
  provider: UserPaymentProvider;
  status: UserPaymentStatus;
  amount: number;
  commissionAmount: number;
  currency: string;
  itemSnapshot: {
    title: string;
    price: number;
    currency: string;
  };
  refundedAmount: number;
  refundReason: string | null;
  createdAt: string;
  updatedAt: string;
}
