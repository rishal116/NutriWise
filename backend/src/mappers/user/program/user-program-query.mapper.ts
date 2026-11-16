import { plainToInstance } from "class-transformer";
import type { ParsedQs } from "qs";

import { UserProgramListQueryDTO } from "../../../dtos/user/program/user-Program-list-query.dto";

export class UserProgramQueryMapper {
  static toListQueryDTO(query: ParsedQs): UserProgramListQueryDTO {
    return plainToInstance(UserProgramListQueryDTO, {
      limit: query.limit,
      cursor: query.cursor,
      search: query.search,
      programStatus: query.programStatus,
      sort: query.sort,
    });
  }
}
