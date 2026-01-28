import { HealthDetailsRequestDTO, HealthDetailsResponseDTO } from "../../../dtos/user/healthDetails.dto";

export interface IHealthDetailsService {
  getMyDetails(userId: string): Promise<HealthDetailsResponseDTO | null>;
  saveDetails(userId: string, payload: HealthDetailsRequestDTO): Promise<HealthDetailsResponseDTO>;
}