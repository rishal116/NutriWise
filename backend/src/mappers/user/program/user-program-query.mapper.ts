import { ParsedQs } from "qs";
import {
  UserProgramListQueryDTO,
  UserProgramSort,
} from "../../../dtos/user/program/user-Program-list-query.dto";
import { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export class UserProgramQueryMapper {
  static toListQueryDTO(query: ParsedQs): UserProgramListQueryDTO {
    return {
      limit: Number(query.limit ?? 10),
      cursor: query.cursor as string | undefined,
      search: query.search as string | undefined,
      programStatus: query.programStatus as ProgramStatus | undefined,
      sort: query.sort as UserProgramSort | undefined,
    };
  }
}
