import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_CLIENT_ROUTES } from "@/routes/nutritionist/client.routes";

import type {
  ClientDetailsResponseDTO,
  ClientListItemDTO,
  MeetingClientOptionDTO,
} from "@/dtos/nutritionist/client/client-response.dto";
import type { GetClientsQueryDTO } from "@/dtos/nutritionist/client/client-request.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

function requireData<T>(response: ApiResponseDTO<T>): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "The server returned no data");
  }

  return response.data;
}

export const nutriClientService = {
  async getClients(
    query: GetClientsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ClientListItemDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ClientListItemDTO>>
    >(NUTRITIONIST_CLIENT_ROUTES.LIST, {
      params: query,
    });

    return requireData(res.data);
  },

  async getMeetingEligibleClients(): Promise<MeetingClientOptionDTO[]> {
    const res = await clientApi.get<ApiResponseDTO<MeetingClientOptionDTO[]>>(
      NUTRITIONIST_CLIENT_ROUTES.MEETING_ELIGIBLE,
    );

    return requireData(res.data);
  },

  async getClientDetails(clientId: string): Promise<ClientDetailsResponseDTO> {
    const res = await clientApi.get<ApiResponseDTO<ClientDetailsResponseDTO>>(
      NUTRITIONIST_CLIENT_ROUTES.DETAILS(clientId),
    );

    return requireData(res.data);
  },
};
