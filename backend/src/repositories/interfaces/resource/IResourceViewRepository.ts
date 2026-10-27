import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";
import { IResourceView } from "../../../models/resourceView.model";

export interface IResourceViewRepository extends IBaseRepository<IResourceView> {
  recordView(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IResourceView | null>;
}
