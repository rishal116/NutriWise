import type { Types } from "mongoose";

import type { UserSessionListQueryDTO } from "../../../../dtos/user/session/user-session-list-query.dto";
import type { ISessionRegistration } from "../../../../models/sessionRegistration.model";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../../types/user/session/user-session.projection";
import type { IBaseRepository } from "../../common/IBaseRepository";

export interface IUserSessionRepository extends IBaseRepository<ISessionRegistration> {
  findUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IUserSessionListProjection>>;

  findUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<IUserSessionDetailsProjection | null>;
}
