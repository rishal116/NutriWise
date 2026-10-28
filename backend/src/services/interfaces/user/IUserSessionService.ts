import type { Types } from "mongoose";

import type { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../types/user/session/user-session.projection";

export interface IUserSessionService {
  getUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IUserSessionListProjection>>;

  getUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<IUserSessionDetailsProjection>;
}
