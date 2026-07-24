import { Types } from "mongoose";

import { GetProgramsQueryDTO } from "../../../dtos/nutritionist/program/program-request.dto";

import {
  ProgramBrowseResult,
  IProgramProjection,
} from "../../../types/userProgram.projection";

export interface INutriProgramRepository {
  findPrograms(
    nutritionistId: string | Types.ObjectId,
    query: GetProgramsQueryDTO,
  ): Promise<ProgramBrowseResult>;

  findProgramById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IProgramProjection | null>;

  existsById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<boolean>;
}
