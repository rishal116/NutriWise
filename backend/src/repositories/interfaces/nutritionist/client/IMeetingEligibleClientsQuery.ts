import type { Types } from "mongoose";

import type { IMeetingClientOption } from "../../../../types/nutritionist/client/nutriClientDetails.projection";

export interface IMeetingEligibleClientsQuery {
  execute(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IMeetingClientOption[]>;
}