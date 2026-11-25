import type { Types } from "mongoose";

import type { ISessionRegistration } from "../../../models/sessionRegistration.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { CursorData } from "../../../types/cursor.types";
import type { INutriSessionParticipantProjection } from "../../../types/nutritionist/session-registration/nutri-session-participant.projection";
import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participants-query.dto";
import type { IBaseRepository } from "../../interfaces/common/IBaseRepository";

export interface INutriSessionRegistrationRepository extends IBaseRepository<ISessionRegistration> {
  findSessionParticipants(
    sessionId: Types.ObjectId,
    query: NutriSessionParticipantsQueryDTO,
    cursor?: CursorData | null,
  ): Promise<CursorPaginationResult<INutriSessionParticipantProjection>>;
}
