import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_CLIENT_ROUTES } from "@/routes/nutritionist/client.routes";

import type {
  ClientDetailsResponseDTO,
  ClientListResponseDTO,
} from "@/dtos/nutritionist/client/client-response.dto";
import { GetClientsQueryDTO } from "@/dtos/nutritionist/client/client-request.dto";
import { ApiResponse } from "@/types/api/apiResponse";

export const nutriClientService = {
  async getClients(query: GetClientsQueryDTO): Promise<ClientListResponseDTO> {
    const res = await clientApi.get<ApiResponse<ClientListResponseDTO>>(
      NUTRITIONIST_CLIENT_ROUTES.LIST,
      {
        params: query,
      },
    );

    return res.data.data;
  },

  async getClientDetails(clientId: string): Promise<ClientDetailsResponseDTO> {
    const res = await clientApi.get<ApiResponse<ClientDetailsResponseDTO>>(
      NUTRITIONIST_CLIENT_ROUTES.DETAILS(clientId),
    );

    return res.data.data;
  },
};
