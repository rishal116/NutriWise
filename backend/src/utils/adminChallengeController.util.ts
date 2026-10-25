
import type { ParsedQs } from "qs";

import type { AdminChallengeListQueryDTO } from "../dtos/admin/challenge/admin-challenge-list-query.dto";

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function toAdminChallengeListQuery(
  query: ParsedQs,
): AdminChallengeListQueryDTO {
  const rawLimit = getString(query.limit);
  const parsedLimit = rawLimit ? Number(rawLimit) : undefined;

  return {
    search: getString(query.search),
    category: getString(query.category) as
      | AdminChallengeListQueryDTO["category"]
      | undefined,
    difficulty: getString(query.difficulty) as
      | AdminChallengeListQueryDTO["difficulty"]
      | undefined,
    accessType: getString(query.accessType) as
      | AdminChallengeListQueryDTO["accessType"]
      | undefined,
    status: getString(query.status) as
      | AdminChallengeListQueryDTO["status"]
      | undefined,
    sortBy: getString(query.sortBy) as
      | AdminChallengeListQueryDTO["sortBy"]
      | undefined,
    cursor: getString(query.cursor),
    limit: parsedLimit,
  };
}
