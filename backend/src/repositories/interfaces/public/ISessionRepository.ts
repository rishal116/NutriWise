import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { ISession } from "../../../models/session.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import { IPublicSessionListItemProjection } from "../../../types/public/session/public-session-list-item.projection";
import { IPublicSessionDetailsProjection } from "../../../types/public/session/public-session-details.projection";

export interface ISessionRepository extends IBaseRepository<ISession> {
  findPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IPublicSessionListItemProjection>>;

  findPublicSessionDetails(
    sessionId: string | Types.ObjectId,
  ): Promise<IPublicSessionDetailsProjection | null>;
}
