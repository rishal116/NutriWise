import { Types } from "mongoose";

import { GetClientsQueryDTO } from "../../../dtos/nutritionist/client/client-request.dto";
import { IClientListProjection } from "../../../types/nutriClientList.projection";
import { IClientDetailsProjection } from "../../../types/nutriClientDetails.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface INutriClientRepository {
  findClients(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<CursorPaginationResult<IClientListProjection>>;

  findClientDetails(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null>;
}
