import { Types } from "mongoose";
import { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import { IUserProgramDetailsProjection } from "../../../../types/user/program/user-program-details.projection";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { UserProgramCardResponseDTO } from "../../../../dtos/user/program/user-program-card-response.dto";

export interface IUserProgramBrowseRepository {
  browsePrograms(
    userId: string | Types.ObjectId,
    query: UserProgramListQueryDTO,
  ): Promise<CursorPaginationResult<UserProgramCardResponseDTO>>;

  findProgramDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null>;
}
