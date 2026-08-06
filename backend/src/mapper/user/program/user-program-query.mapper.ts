import { ParsedQs } from "qs";
import { ProgramStatus } from "../../../models/userProgram.model";
import { SubscriptionStatus } from "../../../models/userPlan.model";
import {
  UserProgramListQueryDTO,
  UserProgramSort,
} from "../../../dtos/user/program/user-Program-list-query.dto";

export class UserProgramQueryMapper {
  static toListQueryDTO(query: ParsedQs): UserProgramListQueryDTO {
    return {
      limit: Number(query.limit ?? 10),
      cursor: query.cursor as string | undefined,
      search: query.search as string | undefined,
      programStatus: query.programStatus as ProgramStatus | undefined,
      subscriptionStatus: query.subscriptionStatus as
        | SubscriptionStatus
        | undefined,
      sort: query.sort as UserProgramSort | undefined,
    };
  }
}
