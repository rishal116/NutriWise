import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { UserProgramModel } from "../../../../models/userProgram.model";
import type { IUserProgram } from "../../../../models/userProgram.model";
import {
  ProgramSortBy,
  type GetProgramsQueryDTO,
} from "../../../../dtos/nutritionist/program/nutri-program-request.dto";
import type { INutriProgramRepository } from "../../../interfaces/nutritionist/INutriProgramRepository";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";
import type {
  INutriProgramCardProjection,
  IProgramCardWithCursor,
} from "../../../../types/nutritionist/program/nutri-program-card.projection";
import type { INutriProgramDetailsProjection } from "../../../../types/nutritionist/program/nutri-program-details.projection";
import { PROGRAM_SORT_CONFIG } from "../../../../constants/nutritionist/program/nutri-program.repository.constants";
import { buildNutriProgramListPipeline } from "./nutri-program-list.pipeline";
import { buildNutriProgramDetailsPipeline } from "./nutri-program-details.pipeline";

@injectable()
export class NutriProgramRepository
  extends BaseRepository<IUserProgram>
  implements INutriProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async findPrograms(
    nutritionistId: string | Types.ObjectId,
    query: GetProgramsQueryDTO,
  ): Promise<CursorPaginationResult<INutriProgramCardProjection>> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const { cursor, limit = 10, sortBy = ProgramSortBy.LATEST } = query;

    const sortConfig = PROGRAM_SORT_CONFIG[sortBy];

    const cursorData = decodeCursor(cursor);

    let cursorValue: string | number | Date | undefined;
    let cursorId: Types.ObjectId | undefined;

    if (cursorData) {
      cursorValue =
        sortConfig.field === "createdAt" ||
        sortConfig.field === "startDate" ||
        sortConfig.field === "endDate"
          ? new Date(cursorData.value)
          : cursorData.value;

      cursorId = new Types.ObjectId(cursorData.id);
    }

    const pipeline = buildNutriProgramListPipeline({
      nutritionistId: nutritionistObjectId,
      query,
      cursorValue,
      cursorId,
    });

    const results = await this._model
      .aggregate<IProgramCardWithCursor>([
        ...pipeline,
        {
          $limit: limit + 1,
        },
      ])
      .exec();

    const hasMore = results.length > limit;
    const items = results.slice(0, limit);
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            id: lastItem.cursorId.toHexString(),
            sortKey: sortBy,
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

  async findProgramById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriProgramDetailsProjection | null> {
    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pipeline = buildNutriProgramDetailsPipeline({
      programId: programObjectId,
      nutritionistId: nutritionistObjectId,
    });

    const [program] = await this._model
      .aggregate<INutriProgramDetailsProjection>(pipeline)
      .exec();

    return program ?? null;
  }
}
