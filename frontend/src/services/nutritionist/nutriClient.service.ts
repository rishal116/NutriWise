import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_CLIENT_ROUTES } from "@/routes/nutritionist/client.routes";

import type {
  ClientDetailsResponseDTO,
  ClientListItemDTO,
} from "@/dtos/nutritionist/client/client-response.dto";

import type { GetClientsQueryDTO } from "@/dtos/nutritionist/client/client-request.dto";

import type { ApiResponse } from "@/types/api/apiResponse";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriClientService = {
  async getClients(
    query: GetClientsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ClientListItemDTO>> {
    const res = await clientApi.get<
      ApiResponse<InfiniteScrollResponseDTO<ClientListItemDTO>>
    >(NUTRITIONIST_CLIENT_ROUTES.LIST, {
      params: query,
    });

    return res.data.data;
  },

  async getClientDetails(clientId: string): Promise<ClientDetailsResponseDTO> {
    const res = await clientApi.get<ApiResponse<ClientDetailsResponseDTO>>(
      NUTRITIONIST_CLIENT_ROUTES.DETAILS(clientId),
    );

    return res.data.data;
  },
};
