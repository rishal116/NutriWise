import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IResourceRepository} from "../../interfaces/common/IResourcRepository";
import { IResource,ResourceModel } from "../../../models/resource.model";

@injectable()
export class ResourceRepository
  extends BaseRepository<IResource>
  implements IResourceRepository
{
  constructor() {
    super(ResourceModel);
  }

  async findByGroup(groupId: string): Promise<IResource[]> {
    return this._model
      .find({ groupId })
      .sort({ createdAt: -1 })
      .lean<IResource[]>();
  }

  async incrementViews(resourceId: string): Promise<void> {
    await this._model.findByIdAndUpdate(resourceId, {
      $inc: { views: 1 },
    });
  }

  async incrementDownloads(resourceId: string): Promise<void> {
    await this._model.findByIdAndUpdate(resourceId, {
      $inc: { downloads: 1 },
    });
  }
}