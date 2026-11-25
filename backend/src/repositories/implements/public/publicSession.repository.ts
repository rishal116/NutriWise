import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { SessionModel } from "../../../models/session.model";
import type { ISession } from "../../../models/session.model";
import type { IPublicSessionRepository } from "../../interfaces/public/IPublicSessionRepository";
import type { GetPublicSessionsQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import type {
  IPublicSessionProjection,
  IPublicSessionCursorProjection,
} from "../../../types/public/session/public-session.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { CursorData } from "../../../types/cursor.types";
import { encodeCursor } from "../../../utils/cursor.util";
import {
  buildPublicSessionListPipeline,
  getPublicSessionSortKey,
} from "../../builders/public/session/public-session-list.pipeline";

import { buildPublicSessionDetailsPipeline } from "../../builders/public/session/public-session-details.pipeline";

@injectable()
export class PublicSessionRepository
  extends BaseRepository<ISession>
  implements IPublicSessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findPublicSessions(
    query: GetPublicSessionsQueryDTO,
    cursor?: CursorData | null,
  ): Promise<CursorPaginationResult<IPublicSessionProjection>> {
    const limit = query.limit ?? 12;

    const pipeline = buildPublicSessionListPipeline(query, cursor);

    const result =
      await this._model.aggregate<IPublicSessionCursorProjection>(pipeline);

    const hasMore = result.length > limit;
    const page = hasMore ? result.slice(0, limit) : result;
    const lastItem = page.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId,
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            sortKey: getPublicSessionSortKey(query.sortBy ?? "all"),
          })
        : null;

    return {
      items: page.map(({ item }) => item),
      nextCursor,
      hasMore,
    };
  }

  async findPublicSessionDetails(
    sessionId: Types.ObjectId,
  ): Promise<IPublicSessionProjection | null> {
    const pipeline = buildPublicSessionDetailsPipeline(sessionId);

    const result =
      await this._model.aggregate<IPublicSessionProjection>(pipeline);

    return result[0] ?? null;
  }

  async findByRoomId(roomId: string): Promise<ISession | null> {
    return this.findOne({
      roomId,
      deletedAt: null,
    });
  }
}
