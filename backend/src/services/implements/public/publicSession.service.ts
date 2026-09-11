import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IPublicSessionService } from "../../interfaces/public/IPublicSessionService";
import { ISessionRepository } from "../../../repositories/interfaces/public/ISessionRepository";
import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";
import { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { PublicSessionMapper } from "../../../mappers/public/session/public-session.mapper";
import logger from "../../../utils/logger";

@injectable()
export class PublicSessionService implements IPublicSessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepository: ISessionRepository,
  ) {}

  async getPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>> {
    console.log(query);
    const result = await this._sessionRepository.findPublicSessions(query);

    logger.debug("Public sessions fetched", {
      count: result.items.length,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    });

    const items = result.items.map((session) =>
      PublicSessionMapper.toListResponse(session),
    );

    logger.debug("Public sessions mapped", {
      count: items.length,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPublicSessionDetails(
    sessionId: string,
  ): Promise<PublicSessionDetailsResponseDTO> {
    const session =
      await this._sessionRepository.findPublicSessionDetails(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    return PublicSessionMapper.toDetailsResponse(session);
  }
}
