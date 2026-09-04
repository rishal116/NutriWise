import { Types } from "mongoose";

import { IBaseRepository } from "../../interfaces/common/IBaseRepository";

import { ISession } from "../../../models/session.model";

import { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/session-list-query.dto";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { INutriSessionListProjection } from "../../../types/nutritionist/session/nutri-session-list.projection";

import { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";

export interface INutriSessionRepository extends IBaseRepository<ISession> {
  findSessions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriSessionsQueryDTO,
  ): Promise<CursorPaginationResult<INutriSessionListProjection>>;

  findSessionDetails(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriSessionDetailsProjection | null>;
}
