export interface IGroupService {
  joinPrivateGroup(
    userId: string,
    inviteToken: string,
  ): Promise<{
    groupId: string;
    joined: boolean;
  }>;
}
