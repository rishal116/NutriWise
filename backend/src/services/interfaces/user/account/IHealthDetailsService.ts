import { HealthDetailsRequestDto } from "../../../../dtos/user/health/health-details.request.dto";
import { HealthDetailsResponseDto } from "../../../../dtos/user/health/health-details.response.dto";

export interface IHealthDetailsService {
  getHealthDetails(userId: string): Promise<HealthDetailsResponseDto | null>;
  saveHealthDetails(
    userId: string,
    payload: HealthDetailsRequestDto,
  ): Promise<HealthDetailsResponseDto>;
}
