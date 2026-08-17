import { Types } from "mongoose";
import { IUserProgramDay } from "../../../../models/userProgramDay.model";
import { IBaseRepository } from "../../common/IBaseRepository";
import {
  IUserProgramDayDetailsProjection,
  IUserProgramDayListProjection,
} from "../../../../types/user/program/user-program-day.projection";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { UserProgramDayListQueryDTO } from "../../../../dtos/user/program/user-program-day-list-query.dto";

export interface IUserProgramDayRepository extends IBaseRepository<IUserProgramDay> {
  browseProgramDays(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    query: UserProgramDayListQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramDayListProjection>>;

  findProgramDayDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserProgramDayDetailsProjection | null>;
}
