import { Types } from "mongoose";
import { GetProgramsQueryDTO } from "../../../dtos/nutritionist/program/program-request.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IUserProgramCardProjection } from "../../../types/nutritionist/program/program-card.projection";
import { IUserProgramDetailsProjection } from "../../../types/nutritionist/program/program-details.projection";

export interface INutriProgramRepository {
  findPrograms(
    nutritionistId: string | Types.ObjectId,
    query: GetProgramsQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramCardProjection>>;

  findProgramById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null>;

  existsById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<boolean>;
}
