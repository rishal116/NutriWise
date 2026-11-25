import type { GetPublicSessionsQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import type { PublicSessionResponseDTO } from "../../../dtos/public/session/public-session-response.dto"; 
import type { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IPublicSessionService {
  getPublicSessions(
    query: GetPublicSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionResponseDTO>>;

  getPublicSessionDetails(
    sessionId: string,
    userId?: string,
  ): Promise<PublicSessionDetailsResponseDTO>;
}