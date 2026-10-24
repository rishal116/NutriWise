import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";
import type { INutriClientRepository } from "../../../interfaces/nutritionist/client/INutriClientRepository";

import type { GetClientsQueryDTO } from "../../../../dtos/nutritionist/client/client-request.dto";
import type { IClientListProjection } from "../../../../types/nutritionist/client/nutriClientList.projection";
import type {
  IClientDetailsProjection,
  IMeetingClientOption,
} from "../../../../types/nutritionist/client/nutriClientDetails.projection";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";

import type { INutriClientListQuery } from "../../../interfaces/nutritionist/client/INutriClientListQuery";
import type { INutriClientDetailsQuery } from "../../../interfaces/nutritionist/client/INutriClientDetailsQuery";
import type { IMeetingEligibleClientsQuery } from "../../../interfaces/nutritionist/client/IMeetingEligibleClientsQuery";

@injectable()
export class NutriClientRepository implements INutriClientRepository {
  constructor(
    @inject(TYPES.INutriClientListQuery)
    private readonly clientListQuery: INutriClientListQuery,

    @inject(TYPES.INutriClientDetailsQuery)
    private readonly clientDetailsQuery: INutriClientDetailsQuery,

    @inject(TYPES.IMeetingEligibleClientsQuery)
    private readonly meetingEligibleClientsQuery: IMeetingEligibleClientsQuery,
  ) {}

  findClients(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<CursorPaginationResult<IClientListProjection>> {
    return this.clientListQuery.execute(nutritionistId, query);
  }

  findClientDetails(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null> {
    return this.clientDetailsQuery.execute(clientId, nutritionistId);
  }

  findMeetingEligibleClients(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IMeetingClientOption[]> {
    return this.meetingEligibleClientsQuery.execute(nutritionistId);
  }
}
