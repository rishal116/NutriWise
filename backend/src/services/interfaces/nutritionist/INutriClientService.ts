import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import {
  GetClientsQueryDTO,
  GetClientParamsDTO,
} from "../../../dtos/nutritionist/client/client-request.dto";

import {
  ClientListItemDTO,
  ClientDetailsResponseDTO,
  MeetingClientOptionDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

export interface INutriClientService {
  getClients(
    nutritionistId: string,
    query: GetClientsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ClientListItemDTO>>;

  getClientDetails(
    nutritionistId: string,
    params: GetClientParamsDTO,
  ): Promise<ClientDetailsResponseDTO>;

  getMeetingEligibleClients(
    nutritionistId: string,
  ): Promise<MeetingClientOptionDTO[]>;
}
