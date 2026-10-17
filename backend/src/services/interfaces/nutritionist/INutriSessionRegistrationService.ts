import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-participants-query.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { INutriSessionParticipantProjection } from "../../../types/nutritionist/session/nutri-session-participant.projection";

export interface INutriSessionRegistrationService {
  getSessionParticipants(
    sessionId: string,
    nutritionistId: string,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<INutriSessionParticipantProjection>>;
}
