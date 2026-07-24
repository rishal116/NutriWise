import { Types } from "mongoose";

import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";

import {
  IProgramDayProjection,
  ProgramDayBrowseResult,
} from "../../../types/userProgramDay.projection";

export interface INutriProgramDayRepository {
  findProgramDays(
    userProgramId: string | Types.ObjectId,
  ): Promise<ProgramDayBrowseResult>;

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
