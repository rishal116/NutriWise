
export type UserSessionRegistrationStatus =
  | "registered"
  | "cancelled"
  | "attended"
  | "absent";

export type UserSessionPaymentStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type UserSessionType =
  | "webinar"
  | "workshop"
  | "group_consultation"
  | "qna"
  | "seminar";

export type UserSessionStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "completed"
  | "cancelled";

export type UserSessionPricingType = "free" | "paid";

export interface UserSessionPricingDTO {
  type: UserSessionPricingType;
  amount: number;
  currency: string;
}

export interface UserSessionListItemDTO {
  registrationId: string;
  sessionId: string;
  registrationStatus: UserSessionRegistrationStatus;
  paymentStatus: UserSessionPaymentStatus;
  registeredAt: string;
  cancelledAt: string | null;
  session: {
    title: string;
    type: UserSessionType;
    pricing: UserSessionPricingDTO;
    scheduledAt: string;
    durationInMinutes: number;
    thumbnailUrl?: string;
    status: UserSessionStatus;
  };
}
