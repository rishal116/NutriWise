import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import {
  IUserProgramDay,
  UserProgramDayModel,
} from "../../../models/userProgramDay.model";
import { INutriProgramDayRepository } from "../../interfaces/nutritionist/INutriProgramDayRepository";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";
import { IProgramDayProjection } from "../../../types/nutritionist/program/program-day.projection";
import { IProgramDayCardProjection } from "../../../types/nutritionist/program/program-day-card.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { PipelineStage, Types } from "mongoose";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/program-day-list-query.dto";
import { ProgramDaySortBy } from "../../../dtos/nutritionist/program/program-day-list-query.dto";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

interface ProgramDayProjectionWithCursor extends IProgramDayCardProjection {
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
  ): Promise<CursorPaginationResult<IProgramDayCardProjection>> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    const {
      cursor,
      limit = 10,
      search,
      category,
      sortBy = ProgramDaySortBy.ASC,
    } = query;

    const cursorData = decodeCursor(cursor);

    const sortDirection: 1 | -1 = sortBy === ProgramDaySortBy.DESC ? -1 : 1;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userProgramId: programId,
        },
      },
    ];

    if (search?.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const dayNumber = Number(search);

      pipeline.push({
        $match: {
          $or: [
            ...(Number.isNaN(dayNumber)
              ? []
              : [
                  {
                    dayNumber,
                  },
                ]),
            {
              "activities.title": {
                $regex: escaped,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (category) {
      pipeline.push({
        $match: {
          "activities.category": category,
        },
      });
    }

    if (cursorData) {
      const cursorDayNumber = Number(cursorData.value);
      const cursorObjectId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match:
          sortDirection === 1
            ? {
                $or: [
                  {
                    dayNumber: {
                      $gt: cursorDayNumber,
                    },
                  },
                  {
                    dayNumber: cursorDayNumber,
                    _id: {
                      $gt: cursorObjectId,
                    },
                  },
                ],
              }
            : {
                $or: [
                  {
                    dayNumber: {
                      $lt: cursorDayNumber,
                    },
                  },
                  {
                    dayNumber: cursorDayNumber,
                    _id: {
                      $lt: cursorObjectId,
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
          activityCount: {
            $size: "$activities",
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
    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      nextCursor = encodeCursor({
        value: lastItem.cursorValue,
        id: lastItem.cursorId.toString(),
      });
    }

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
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return this._model.findById(id).lean<IProgramDayProjection | null>();
  }

  async createProgramDay(
    userProgramId: string | Types.ObjectId,
    dto: CreateProgramDayDTO,
  ): Promise<IProgramDayProjection> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    return this._model.create({
      ...dto,
      userProgramId: programId,
    });
  }

  async updateProgramDay(
    dayId: string | Types.ObjectId,
    dto: UpdateProgramDayDTO,
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return this._model
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .lean<IProgramDayProjection | null>();
  }

  async deleteProgramDay(dayId: string | Types.ObjectId): Promise<boolean> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    const result = await this._model.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }

  async existsByDayNumber(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<boolean> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    return (
      (await this._model.exists({
        userProgramId: programId,
        dayNumber,
      })) !== null
    );
  }

  async existsById(dayId: string | Types.ObjectId): Promise<boolean> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return (
      (await this._model.exists({
        _id: id,
      })) !== null
    );
  }
}
