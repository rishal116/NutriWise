import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participants-query.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutriSessionParticipantDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participant.dto";

export interface INutriSessionRegistrationService {
  getSessionParticipants(
    sessionId: string,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionParticipantDTO>>;
}
