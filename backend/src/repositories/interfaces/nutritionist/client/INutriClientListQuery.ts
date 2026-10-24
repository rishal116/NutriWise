import type { Types } from "mongoose";

import type { GetClientsQueryDTO } from "../../../../dtos/nutritionist/client/client-request.dto";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { IClientListProjection } from "../../../../types/nutritionist/client/nutriClientList.projection";

export interface INutriClientListQuery {
  execute(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<CursorPaginationResult<IClientListProjection>>;
}
