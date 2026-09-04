import { SessionRegistrationResponseDTO } from "./session-registration-response.dto";

export class SessionRegistrationActionResponseDTO {
  registration?: SessionRegistrationResponseDTO;

  checkoutUrl?: string;
}
