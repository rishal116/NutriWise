import { inject, injectable } from "inversify";

import type { INutriSessionRegistrationService } from "../../interfaces/nutritionist/INutriSessionRegistrationService";
import type { INutriSessionRegistrationRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRegistrationRepository";
import type { INutriSessionRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRepository";

import { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participants-query.dto";
import type { NutriSessionParticipantDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participant.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { decodeCursor } from "../../../utils/cursor.util";
import { toObjectId } from "../../../utils/object-id.util";

import { mapNutriSessionParticipant } from "../../../mappers/nutritionist/session-registration/nutri-session-participant.mapper";

@injectable()
export class NutriSessionRegistrationService implements INutriSessionRegistrationService {
  constructor(
    @inject(TYPES.INutriSessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: INutriSessionRegistrationRepository,

    @inject(TYPES.INutriSessionRepository)
    private readonly _nutriSessionRepository: INutriSessionRepository,
  ) {}

  async getSessionParticipants(
    sessionId: string,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionParticipantDTO>> {
    const validatedQuery = await validateDto(
      NutriSessionParticipantsQueryDTO,
      query,
    );

    const session = await this._nutriSessionRepository.findById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const cursor = decodeCursor(validatedQuery.cursor);

    const result =
      await this._sessionRegistrationRepository.findSessionParticipants(
        toObjectId(sessionId, "Session ID"),
        validatedQuery,
        cursor,
      );

    const items = result.items.map(mapNutriSessionParticipant);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }
}
