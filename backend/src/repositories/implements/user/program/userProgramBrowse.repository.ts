import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import type { IUserProgramBrowseRepository } from "../../../interfaces/user/program/IUserProgramBrowseRepository";
import { UserProgramModel } from "../../../../models/userProgram.model";
import type { IUserProgram } from "../../../../models/userProgram.model";
import {
  UserProgramSort,
  type UserProgramListQueryDTO,
} from "../../../../dtos/user/program/user-Program-list-query.dto";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { IUserProgramCardProjection } from "../../../../types/user/program/user-program-card.projection";
import type { IUserProgramDetailsProjection } from "../../../../types/user/program/user-program-details.projection";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import {
  USER_PROGRAM_SORT_FIELD_MAP,
  createUserProgramBrowsePipeline,
  createUserProgramDetailsPipeline,
} from "../program/user-program-browse.query";

interface IProgramCardWithCursor extends IUserProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

@injectable()
export class UserProgramBrowseRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramBrowseRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async browsePrograms(
    userId: Types.ObjectId,
    query: UserProgramListQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramCardProjection>> {
    const {
      limit = 10,
      search,
      programStatus,
      sort = UserProgramSort.NEWEST,
      cursor,
    } = query;

    const sortConfig = USER_PROGRAM_SORT_FIELD_MAP[sort];

    const cursorData = decodeCursor(cursor);

    const validatedCursor = cursorData
      ? {
          id: new Types.ObjectId(cursorData.id),
          value: new Date(cursorData.value),
          sortKey: cursorData.sortKey,
        }
      : undefined;

    const pipeline = createUserProgramBrowsePipeline({
      userId,
      programStatus,
      searchText: search?.trim(),
      sortField: sortConfig.field,
      sortOrder: sortConfig.order,
      cursor: validatedCursor,
      limit,
    });

    const result =
      await this._model.aggregate<IProgramCardWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sort,
          })
        : null;

    const cleanItems: IUserProgramCardProjection[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findProgramDetails(
    userId: Types.ObjectId,
    programId: Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null> {
    const pipeline = createUserProgramDetailsPipeline(userId, programId);

    const [program] =
      await this._model.aggregate<IUserProgramDetailsProjection>(pipeline);

    return program ?? null;
  }
}
