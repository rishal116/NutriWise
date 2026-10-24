
import type { Types } from "mongoose";

import type { IClientDetailsProjection } from "../../../../types/nutritionist/client/nutriClientDetails.projection";

export interface INutriClientDetailsQuery {
  execute(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null>;
}
