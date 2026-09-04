import { SessionRegistrationResponseDTO } from "../../../dtos/public/session-registration/session-registration-response.dto";
import { SessionRegistrationCheckoutResponseDTO } from "../../../dtos/public/session-registration/session-registration-checkout-response.dto";

export interface ISessionRegistrationService {
  registerForSession(
    userId: string,
    sessionId: string,
  ): Promise<
    SessionRegistrationResponseDTO | SessionRegistrationCheckoutResponseDTO
  >;

  getMySessionRegistration(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationResponseDTO>;

  cancelSessionRegistration(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationResponseDTO>;
}
