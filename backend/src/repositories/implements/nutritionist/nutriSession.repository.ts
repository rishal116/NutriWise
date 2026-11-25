import { injectable } from "inversify";
import { Types } from "mongoose";
import { SessionModel } from "../../../models/session.model";
import type { ISession } from "../../../models/session.model";
import { BaseRepository } from "../../implements/common/base.repository";
import type { INutriSessionRepository } from "../../interfaces/nutritionist/INutriSessionRepository";
import type { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-list-query.dto";
import { encodeCursor } from "../../../utils/cursor.util";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type {
  INutriSessionListItemProjection,
  INutriSessionListItemCursorProjection,
} from "../../../types/nutritionist/session/nutri-session-list.projection";
import type { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";
import { buildNutriSessionListPipeline } from "../../builders/nutritionist/session/nutri-session-list.pipeline";
import { CursorData } from "../../../types/cursor.types";
import { NUTRI_SESSION_SORT_CONFIG } from "../../../constants/nutritionist/session/session-sort.constants";

@injectable()
export class NutriSessionRepository
  extends BaseRepository<ISession>
  implements INutriSessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findSessions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriSessionsQueryDTO,
    cursorData?: CursorData | null,
  ): Promise<CursorPaginationResult<INutriSessionListItemProjection>> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pipeline = buildNutriSessionListPipeline(
      nutritionistObjectId,
      query,
      cursorData,
    );

    const result =
      await this._model.aggregate<INutriSessionListItemCursorProjection>(
        pipeline,
      );

    const limit = query.limit ?? 10;
    const hasMore = result.length > limit;
    const page = result.slice(0, limit);
    const lastItem = page.at(-1);

    const sortBy = query.sortBy ?? "latest";
    const { field, direction } = NUTRI_SESSION_SORT_CONFIG[sortBy];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue,
            sortKey: `${sortBy}:${field}:${direction}`,
          })
        : null;

    const items = page.map(({ cursorId, cursorValue, ...listItem }) => {
      void cursorId;
      void cursorValue;

      return listItem;
    });

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findSessionDetails(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriSessionDetailsProjection | null> {
    const sessionObjectId =
      typeof sessionId === "string" ? new Types.ObjectId(sessionId) : sessionId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const session = await this._model
      .findOne({
        _id: sessionObjectId,
        nutritionistId: nutritionistObjectId,
        deletedAt: null,
      })
      .select({
        title: 1,
        description: 1,
        type: 1,
        pricingType: 1,
        pricing: 1,
        scheduledAt: 1,
        duration: 1,
        endTime: 1,
        maxParticipants: 1,
        roomId: 1,
        thumbnailUrl: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .lean()
      .exec();

    if (!session) return null;

    return {
      sessionId: session._id,
      title: session.title,
      description: session.description,
      type: session.type,
      pricingType: session.pricingType,
      ...(session.pricing && { pricing: session.pricing }),
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      ...(session.endTime && { endTime: session.endTime }),
      maxParticipants: session.maxParticipants,
      roomId: session.roomId,
      ...(session.thumbnailUrl && {
        thumbnailUrl: session.thumbnailUrl,
      }),
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
