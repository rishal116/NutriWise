import { IResource } from "../../../models/resource.model";

export interface IResourceRepository {
  findByGroup(groupId: string): Promise<IResource[]>;

  incrementViews(resourceId: string): Promise<void>;

  incrementDownloads(resourceId: string): Promise<void>;
}