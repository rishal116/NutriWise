import type { PaymentStatus } from "@/constants/common/payment.constants";
import type { SessionRegistrationStatus } from "@/constants/common/session-registration.constants";

export interface NutriSessionParticipantResponseDTO {
  registrationId: string;
  userId: string;
  fullName: string;
  username: string;
  profileImage?: string;
  status: SessionRegistrationStatus;
  paymentStatus: PaymentStatus | null;
  registeredAt: string;
}