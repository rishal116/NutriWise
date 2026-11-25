import type { Types } from "mongoose";
import type { IBaseRepository } from "../common/IBaseRepository";
import type { ISession } from "../../../models/session.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { CursorData } from "../../../types/cursor.types";
import type { GetPublicSessionsQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import type { IPublicSessionProjection } from "../../../types/public/session/public-session.projection";

export interface IPublicSessionRepository extends IBaseRepository<ISession> {
  findPublicSessions(
    query: GetPublicSessionsQueryDTO,
    cursor?: CursorData | null,
  ): Promise<CursorPaginationResult<IPublicSessionProjection>>;

  findPublicSessionDetails(
    sessionId: string | Types.ObjectId,
  ): Promise<IPublicSessionProjection | null>;

  findByRoomId(roomId: string): Promise<ISession | null>;
}
