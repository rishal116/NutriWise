import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { IPublicSessionService } from "../../interfaces/public/IPublicSessionService";
import { IPublicSessionRepository } from "../../../repositories/interfaces/public/IPublicSessionRepository";
import { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";

import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";
import { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { PublicSessionMapper } from "../../../mappers/public/session/public-session.mapper";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class PublicSessionService implements IPublicSessionService {
  constructor(
    @inject(TYPES.IPublicSessionRepository)
    private readonly _sessionRepository: IPublicSessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,
  ) {}

  async getPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>> {
    const validatedQuery = await validateDto(PublicSessionListQueryDTO, query);

    const result =
      await this._sessionRepository.findPublicSessions(validatedQuery);

    const items = result.items.map(PublicSessionMapper.toListResponse);

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
    if (!Types.ObjectId.isValid(sessionId)) {
      throw new CustomError("Invalid session ID", StatusCode.BAD_REQUEST);
    }

    if (userId && !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    const session =
      await this._sessionRepository.findPublicSessionDetails(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const isHost = userId === session.nutritionist.nutritionistId.toString();

    const registration =
      userId && !isHost
        ? await this._sessionRegistrationRepository.findBySessionAndUser(
            new Types.ObjectId(sessionId),
            new Types.ObjectId(userId),
          )
        : null;

    return {
      ...PublicSessionMapper.toDetailsResponse(session),
      isRegistered: registration?.status === "registered",
    };
  }
}
