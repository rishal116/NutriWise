import { SessionRegistrationStatus } from "../../../models/sessionRegistration.model";

export class SessionRegistrationResponseDTO {
  registrationId: string;

  sessionId: string;

  userId: string;

  status: SessionRegistrationStatus;

  registeredAt: Date;

  cancelledAt?: Date;

  attendedAt?: Date;

  constructor(data: {
    registrationId: string;
    sessionId: string;
    userId: string;
    status: SessionRegistrationStatus;
    registeredAt: Date;
    cancelledAt?: Date;
    attendedAt?: Date;
  }) {
    this.registrationId = data.registrationId;
    this.sessionId = data.sessionId;
    this.userId = data.userId;
    this.status = data.status;
    this.registeredAt = data.registeredAt;
    this.cancelledAt = data.cancelledAt;
    this.attendedAt = data.attendedAt;
  }
}
