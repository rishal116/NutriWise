import type { PublicSessionResponseDTO } from "./public-session-response.dto";

export interface PublicSessionDetailsResponseDTO
  extends PublicSessionResponseDTO {
  isRegistered: boolean;
}