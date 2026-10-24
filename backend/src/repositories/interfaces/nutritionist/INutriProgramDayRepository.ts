import type { Types } from "mongoose";

import type { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/nutri-program-day-list-query.dto";
import type { INutriProgramDayProjection } from "../../../types/nutritionist/program/nutri-program-day.projection";
import type { INutriProgramDayCardProjection } from "../../../types/nutritionist/program/nutri-program-day-card.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IBaseRepository } from "../common/IBaseRepository";
import { IUserProgramDay } from "../../../models/userProgramDay.model";

export interface INutriProgramDayRepository extends IBaseRepository<IUserProgramDay> {
  findProgramDays(
    userProgramId: string | Types.ObjectId,
    query: ProgramDayListQueryDTO,
  ): Promise<CursorPaginationResult<INutriProgramDayCardProjection>>;

  findProgramDayById(
    dayId: string | Types.ObjectId,
  ): Promise<INutriProgramDayProjection | null>;

  existsByDayNumber(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<boolean>;
}
