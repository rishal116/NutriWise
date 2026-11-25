import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto";
import { UserSessionListResponseDTO } from "../../../dtos/user/session/user-session-list-response.dto";
import { UserSessionDetailsResponseDTO } from "../../../dtos/user/session/user-session-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";

import type { IUserSessionRepository } from "../../../repositories/interfaces/user/session/IUserSessionRepository";
import type { IUserSessionService } from "../../interfaces/user/IUserSessionService";

import { validateDto } from "../../../middlewares/validateDto.middleware";
import { toObjectId } from "../../../utils/object-id.util";
import { CustomError } from "../../../utils/customError";
import { UserSessionMapper } from "../../../mappers/user/session/user-session.mapper";

@injectable()
export class UserSessionService implements IUserSessionService {
  constructor(
    @inject(TYPES.IUserSessionRepository)
    private readonly _userSessionRepository: IUserSessionRepository,
  ) {}

  async getUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserSessionListResponseDTO>> {
    const userObjectId = toObjectId(userId, "User ID");

    const validatedQuery = await validateDto(UserSessionListQueryDTO, query);

    const result = await this._userSessionRepository.findUserSessions(
      userObjectId,
      validatedQuery,
    );

    const items = result.items.map(UserSessionMapper.toListResponse);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<UserSessionDetailsResponseDTO> {
    const userObjectId = toObjectId(userId, "User ID");
    const sessionObjectId = toObjectId(sessionId, "Session ID");

    const session = await this._userSessionRepository.findUserSessionDetails(
      userObjectId,
      sessionObjectId,
    );

    if (!session) {
      throw new CustomError(
        "Session registration not found",
        StatusCode.NOT_FOUND,
      );
    }

    return UserSessionMapper.toDetailsResponse(session);
  }
}
