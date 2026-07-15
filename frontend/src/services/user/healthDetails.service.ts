import { clientApi } from "@/lib/axios/clientApi";
import { HEALTH_ROUTES } from "@/routes/user";
import { HealthDetailsRequestDto } from "@/dtos/user/health/health-details.request.dto";
import { HealthDetailsResponseDto } from "@/dtos/user/health/health-details.response.dto";

export const healthDetailsService = {
  async getHealthDetails(): Promise<HealthDetailsResponseDto> {
    const response = await clientApi.get(
      HEALTH_ROUTES.HEALTH,
    );

    return response.data.data;
  },

  async saveHealthDetails(
    dto: HealthDetailsRequestDto,
  ): Promise<HealthDetailsResponseDto> {
    const response = await clientApi.post(
      HEALTH_ROUTES.HEALTH,
      dto,
    );

    return response.data.data;
  },
};
