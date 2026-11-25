import type { SessionRegistrationStatus } from "../../../constants/common/session-registration.constants";
import type { PaymentStatus } from "../../../constants/common/payment.constants";

export interface NutriSessionParticipantDTO {
  registrationId: string;
  userId: string;
  fullName: string;
  username: string;
  profileImage?: string;
  status: SessionRegistrationStatus;
  paymentStatus: PaymentStatus | null;
  registeredAt: Date;
}
