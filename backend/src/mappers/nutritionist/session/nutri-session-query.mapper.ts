import type { Request } from "express";

import {
  NutriSessionSortOption,
  type GetNutriSessionsQueryDTO,
} from "../../../dtos/nutritionist/session/nutri-session-list-query.dto";

export class NutriSessionQueryMapper {
  static toDTO(query: Request["query"]): GetNutriSessionsQueryDTO {
    return {
      limit: Number(query.limit) || 10,
      cursor: query.cursor as string,
      search: query.search as string,
      status: query.status as GetNutriSessionsQueryDTO["status"],
      type: query.type as GetNutriSessionsQueryDTO["type"],
      sortBy: query.sortBy as NutriSessionSortOption,
    };
  }
}
