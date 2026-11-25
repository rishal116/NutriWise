import type { PaymentStatus } from "@/constants/common/payment.constants";
import type { SessionRegistrationStatus } from "@/constants/common/session-registration.constants";

export interface NutriSessionParticipantsQueryDTO {
  search?: string;
  status?: SessionRegistrationStatus;
  paymentStatus?: PaymentStatus;
  cursor?: string;
  limit?: number;
}