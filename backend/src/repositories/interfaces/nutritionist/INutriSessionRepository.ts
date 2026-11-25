import { Types } from "mongoose";
import type { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import type { ISession } from "../../../models/session.model";
import type { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-list-query.dto";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { INutriSessionListItemProjection } from "../../../types/nutritionist/session/nutri-session-list.projection";
import type { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";
import { CursorData } from "../../../types/cursor.types";

export interface INutriSessionRepository extends IBaseRepository<ISession> {
  findSessions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriSessionsQueryDTO,
    cursorData?: CursorData | null,
  ): Promise<CursorPaginationResult<INutriSessionListItemProjection>>;

  findSessionDetails(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriSessionDetailsProjection | null>;
}
