import { Types } from "mongoose";

import { GetClientsQueryDTO } from "../../../dtos/nutritionist/client/client-request.dto";
import { ClientBrowseResult } from "../../../types/nutriClientList.projection";
import { IClientDetailsProjection } from "../../../types/nutriClientDetails.projection";

export interface INutriClientRepository {
  findClients(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<ClientBrowseResult>;

  findClientDetails(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null>;
}
