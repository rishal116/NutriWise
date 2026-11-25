import type { Types } from "mongoose";

import type { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto";
import type { UserSessionListResponseDTO } from "../../../dtos/user/session/user-session-list-response.dto";
import type { UserSessionDetailsResponseDTO } from "../../../dtos/user/session/user-session-details-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IUserSessionService {
  getUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserSessionListResponseDTO>>;

  getUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<UserSessionDetailsResponseDTO>;
}
