import { Types } from "mongoose";

import { IUserProgram } from "../../../models/userProgram.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { GetProgramsQueryDTO } from "../../../dtos/nutritionist/program/nutri-program-request.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { INutriProgramCardProjection } from "../../../types/nutritionist/program/nutri-program-card.projection";
import { INutriProgramDetailsProjection } from "../../../types/nutritionist/program/nutri-program-details.projection";

export interface INutriProgramRepository extends IBaseRepository<IUserProgram> {
  findPrograms(
    nutritionistId: string | Types.ObjectId,
    query: GetProgramsQueryDTO,
  ): Promise<CursorPaginationResult<INutriProgramCardProjection>>;

  findProgramById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriProgramDetailsProjection | null>;

  existsById(programId: string, nutritionistId: string): Promise<boolean>;
}
