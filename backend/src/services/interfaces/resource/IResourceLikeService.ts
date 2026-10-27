export interface IResourceLikeService {
  likeResource(resource: string, userId: string): Promise<void>;

  unlikeResource(resource: string, userId: string): Promise<void>;
}