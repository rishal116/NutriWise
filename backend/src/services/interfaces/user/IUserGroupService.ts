import { GroupDto } from "../../../dtos/user/group.dto";

type JoinGroupResponse = {
  status: "joined" | "requested";
};

export interface IUserGroupService {
  getGroups(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<{
    groups: GroupDto[];
    total: number;
  }>;

  joinGroup(userId: string, groupId: string): Promise<JoinGroupResponse>;
}
