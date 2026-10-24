import type { Types } from "mongoose";

import type { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import type { IUserProgramDetailsProjection } from "../../../../types/user/program/user-program-details.projection";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { IUserProgramCardProjection } from "../../../../types/user/program/user-program-card.projection";

export interface IUserProgramBrowseRepository {
  browsePrograms(
    userId: string | Types.ObjectId,
    query: UserProgramListQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramCardProjection>>;

  findProgramDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null>;
}
