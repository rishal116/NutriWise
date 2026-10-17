import type { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import type { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";
import type { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IPublicSessionService {
  getPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>>;

  getPublicSessionDetails(
    sessionId: string,
    userId?: string,
  ): Promise<PublicSessionDetailsResponseDTO>;
}
