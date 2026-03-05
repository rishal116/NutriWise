import { HealthDetailsRequestDTO, HealthDetailsResponseDTO } from "../../../dtos/user/healthDetails.dto";

export interface IHealthDetailsService {
  getHealthDetails(userId: string): Promise<HealthDetailsResponseDTO | null>;
  saveHealthDetails(userId: string, payload: HealthDetailsRequestDTO): Promise<HealthDetailsResponseDTO>;
}