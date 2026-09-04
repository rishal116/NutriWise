import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";

import { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";

import { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IPublicSessionService {
  getPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>>;

  getPublicSessionDetails(
    sessionId: string,
  ): Promise<PublicSessionDetailsResponseDTO>;
}
