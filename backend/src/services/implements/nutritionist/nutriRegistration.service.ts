import { inject, injectable } from "inversify";

import type { INutriSessionRegistrationService } from "../../interfaces/nutritionist/INutriSessionRegistrationService";
import type { INutriSessionRegistrationRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRegistrationRepository";
import type { INutriSessionRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRepository";
import { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-participants-query.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { INutriSessionParticipantProjection } from "../../../types/nutritionist/session/nutri-session-participant.projection";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";

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
    nutritionistId: string,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<INutriSessionParticipantProjection>> {
    const validatedQuery = await validateDto(
      NutriSessionParticipantsQueryDTO,
      query,
    );

    const session = await this._nutriSessionRepository.findSessionDetails(
      sessionId,
      nutritionistId,
    );

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const result =
      await this._sessionRegistrationRepository.findSessionParticipants(
        sessionId,
        nutritionistId,
        validatedQuery,
      );

    return new InfiniteScrollResponseDTO(
      result.items,
      result.nextCursor,
      result.hasMore,
    );
  }
}
