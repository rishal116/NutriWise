import { Types } from "mongoose";

import type { ISessionRegistration } from "../../../models/sessionRegistration.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { INutriSessionParticipantProjection } from "../../../types/nutritionist/session/nutri-session-participant.projection";
import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-participants-query.dto";
import type { IBaseRepository } from "../../interfaces/common/IBaseRepository";

export interface INutriSessionRegistrationRepository extends IBaseRepository<ISessionRegistration> {
  findSessionParticipants(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<CursorPaginationResult<INutriSessionParticipantProjection>>;
}
