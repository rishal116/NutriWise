import {
  GetClientsQueryDTO,
  GetClientParamsDTO,
} from "../../../dtos/nutritionist/client/client-request.dto";

import {
  ClientListResponseDTO,
  ClientDetailsResponseDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

export interface INutriClientService {
  getClients(
    nutritionistId: string,
    query: GetClientsQueryDTO,
  ): Promise<ClientListResponseDTO>;

  getClientDetails(
    nutritionistId: string,
    params: GetClientParamsDTO,
  ): Promise<ClientDetailsResponseDTO>;
}
