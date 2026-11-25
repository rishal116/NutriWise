import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { IPublicSessionService } from "../../interfaces/public/IPublicSessionService";
import type { IPublicSessionRepository } from "../../../repositories/interfaces/public/IPublicSessionRepository";
import type { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";

import { GetPublicSessionsQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import type { PublicSessionResponseDTO } from "../../../dtos/public/session/public-session-response.dto";
import type { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { PublicSessionMapper } from "../../../mappers/public/session/public-session.mapper";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { toObjectId } from "../../../utils/object-id.util";
import { decodeCursor } from "../../../utils/cursor.util";
import { PUBLIC_SESSION_SORT_CONFIG } from "../../../constants/public/session/session-sort.constants";

@injectable()
export class PublicSessionService implements IPublicSessionService {
  constructor(
    @inject(TYPES.IPublicSessionRepository)
    private readonly _sessionRepository: IPublicSessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,
  ) {}

  async getPublicSessions(
    query: GetPublicSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionResponseDTO>> {
    const validatedQuery = await validateDto(GetPublicSessionsQueryDTO, query);

    const cursor = decodeCursor(validatedQuery.cursor);

    const sortBy = validatedQuery.sortBy ?? "all";

    const { field, direction } = PUBLIC_SESSION_SORT_CONFIG[sortBy];

    const expectedSortKey = `${sortBy}:${field}:${direction}`;

    if (cursor?.sortKey && cursor.sortKey !== expectedSortKey) {
      throw new CustomError(
        "Cursor does not match the selected sorting option",
        StatusCode.BAD_REQUEST,
      );
    }

    const result = await this._sessionRepository.findPublicSessions(
      validatedQuery,
      cursor,
    );

    const items = result.items.map(PublicSessionMapper.toResponse);
    console.log(items);

    logger.debug("Public sessions fetched and mapped", {
      count: items.length,
      hasMore: result.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPublicSessionDetails(
    sessionId: string,
    userId?: string,
  ): Promise<PublicSessionDetailsResponseDTO> {
    console.log(sessionId,userId);
    
    const sessionObjectId = toObjectId(sessionId, "session ID");

    const userObjectId = userId ? toObjectId(userId, "user ID") : undefined;

    const session =
      await this._sessionRepository.findPublicSessionDetails(sessionObjectId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const isHost =
      userObjectId?.toString() ===
      session.nutritionist.nutritionistId.toString();

    const registration =
      userObjectId && !isHost
        ? await this._sessionRegistrationRepository.findBySessionAndUser(
            sessionObjectId,
            userObjectId,
          )
        : null;

    return {
      ...PublicSessionMapper.toResponse(session),
      isRegistered: registration?.status === "registered",
    };
  }
}
