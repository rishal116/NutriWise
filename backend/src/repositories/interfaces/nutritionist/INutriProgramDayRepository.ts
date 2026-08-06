import { Types } from "mongoose";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";
import { IProgramDayProjection } from "../../../types/nutritionist/program/program-day.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IProgramDayCardProjection } from "../../../types/nutritionist/program/program-day-card.projection";

export interface INutriProgramDayRepository {
  findProgramDays(
    userProgramId: string | Types.ObjectId,
  ): Promise<CursorPaginationResult<IProgramDayCardProjection>>;

  findProgramDayById(
    dayId: string | Types.ObjectId,
  ): Promise<IProgramDayProjection | null>;

  createProgramDay(
    userProgramId: string | Types.ObjectId,
    dto: CreateProgramDayDTO,
  ): Promise<IProgramDayProjection>;

  updateProgramDay(
    dayId: string | Types.ObjectId,
    dto: UpdateProgramDayDTO,
  ): Promise<IProgramDayProjection | null>;

  deleteProgramDay(dayId: string | Types.ObjectId): Promise<boolean>;

  existsById(dayId: string | Types.ObjectId): Promise<boolean>;

  existsByDayNumber(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<boolean>;
}
