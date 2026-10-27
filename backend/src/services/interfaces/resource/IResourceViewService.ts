export interface IResourceViewService {
  viewResource(resourceId: string, userId?: string): Promise<void>;
}