import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";
import { TYPES } from "../../../types/types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../types/user/session/user-session.projection";
import type { IUserSessionRepository } from "../../../repositories/interfaces/user/session/IUserSessionRepository";
import type { IUserSessionService } from "../../interfaces/user/IUserSessionService";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class UserSessionService implements IUserSessionService {
  constructor(
    @inject(TYPES.IUserSessionRepository)
    private readonly _userSessionRepository: IUserSessionRepository,
  ) {}

  async getUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IUserSessionListProjection>> {
    const validatedQuery = await validateDto(UserSessionListQueryDTO, query);

    this.validateObjectId(userId, "Invalid user ID");

    return this._userSessionRepository.findUserSessions(userId, validatedQuery);
  }

  async getUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<IUserSessionDetailsProjection> {
    this.validateObjectId(userId, "Invalid user ID");
    this.validateObjectId(sessionId, "Invalid session ID");

    const session = await this._userSessionRepository.findUserSessionDetails(
      userId,
      sessionId,
    );

    if (!session) {
      throw new CustomError(
        "Session registration not found",
        StatusCode.NOT_FOUND,
      );
    }

    return session;
  }

  private validateObjectId(
    value: string | Types.ObjectId,
    message: string,
  ): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new CustomError(message, StatusCode.BAD_REQUEST);
    }
  }
}
