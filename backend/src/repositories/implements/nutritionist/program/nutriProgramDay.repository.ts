import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import {
  UserProgramDayModel,
  type IUserProgramDay,
} from "../../../../models/userProgramDay.model";

import type { INutriProgramDayRepository } from "../../../interfaces/nutritionist/INutriProgramDayRepository";
import {
  ProgramDaySortBy,
  type ProgramDayListQueryDTO,
} from "../../../../dtos/nutritionist/program-day/nutri-program-day-list-query.dto";

import type { INutriProgramDayProjection } from "../../../../types/nutritionist/program/nutri-program-day.projection";
import type { INutriProgramDayCardProjection } from "../../../../types/nutritionist/program/nutri-program-day-card.projection";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";

import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";

interface ProgramDayProjectionWithCursor extends INutriProgramDayCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: number;
}

@injectable()
export class NutriProgramDayRepository
  extends BaseRepository<IUserProgramDay>
  implements INutriProgramDayRepository
{
  constructor() {
    super(UserProgramDayModel);
  }

  async findProgramDays(
    userProgramId: string | Types.ObjectId,
    query: ProgramDayListQueryDTO,
  ): Promise<CursorPaginationResult<INutriProgramDayCardProjection>> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    const { cursor, limit = 10, sortBy = ProgramDaySortBy.ASC } = query;

    const sortDirection: 1 | -1 = sortBy === ProgramDaySortBy.DESC ? -1 : 1;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userProgramId: programId,
        },
      },
    ];

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      const cursorDayNumber = Number(cursorData.value);
      const cursorObjectId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match: {
          $or: [
            {
              dayNumber: {
                [sortDirection === 1 ? "$gt" : "$lt"]: cursorDayNumber,
              },
            },
            {
              dayNumber: cursorDayNumber,
              _id: {
                [sortDirection === 1 ? "$gt" : "$lt"]: cursorObjectId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          dayNumber: sortDirection,
          _id: sortDirection,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,
          userProgramDayId: "$_id",
          userProgramId: 1,
          dayNumber: 1,

          totalActivityCount: {
            $size: {
              $ifNull: ["$activities", []],
            },
          },

          totalRequiredActivityCount: {
            $size: {
              $filter: {
                input: {
                  $ifNull: ["$activities", []],
                },
                as: "activity",
                cond: {
                  $eq: ["$$activity.isRequired", true],
                },
              },
            },
          },

          cursorId: "$_id",
          cursorValue: "$dayNumber",
        },
      },
    );

    const result =
      await UserProgramDayModel.aggregate<ProgramDayProjectionWithCursor>(
        pipeline,
      ).exec();

    const hasMore = result.length > limit;
    const items = result.slice(0, limit);
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            value: lastItem.cursorValue,
            id: lastItem.cursorId.toString(),
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }

  async findProgramDayById(
    dayId: string | Types.ObjectId,
  ): Promise<INutriProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return this._model
      .findById(id)
      .select("_id userProgramId dayNumber activities")
      .lean<INutriProgramDayProjection>()
      .exec();
  }
}
