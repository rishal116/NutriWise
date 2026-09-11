import { ISessionRegistration } from "../../../models/sessionRegistration.model";

import { SessionRegistrationResponseDTO } from "../../../dtos/public/session-registration/session-registration-response.dto";

export class SessionRegistrationMapper {
  static toResponse(
    registration: ISessionRegistration,
  ): SessionRegistrationResponseDTO {
    return new SessionRegistrationResponseDTO({
      registrationId: registration._id.toString(),
      sessionId: registration.sessionId.toString(),
      userId: registration.userId.toString(),
      status: registration.status,
      registeredAt: registration.registeredAt,
      cancelledAt: registration.cancelledAt,
      attendedAt: registration.attendedAt,
    });
  }
}
