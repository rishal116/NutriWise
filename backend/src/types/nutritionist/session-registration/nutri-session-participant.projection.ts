import { Types } from "mongoose";

import type { SessionRegistrationStatus } from "../../../constants/common/session-registration.constants";
import type { PaymentStatus } from "../../../constants/common/payment.constants";

export interface INutriSessionParticipantProjection {
  registrationId: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  username: string;
  profileImage?: string;
  status: SessionRegistrationStatus;
  paymentStatus: PaymentStatus | null;
  registeredAt: Date;
}
