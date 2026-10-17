import { Types } from "mongoose";

import {
  SessionRegistrationPaymentStatus,
  SessionRegistrationStatus,
} from "../../../models/sessionRegistration.model";

export interface INutriSessionParticipantProjection {
  registrationId: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  username: string;
  profileImage?: string;
  status: SessionRegistrationStatus;
  paymentStatus: SessionRegistrationPaymentStatus;
  registeredAt: Date;
}
