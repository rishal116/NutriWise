import { GroupDto } from "../../../dtos/user/group.dto";

export interface IUserGroupService {
  getGroups(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<{
    groups: GroupDto[];
    total: number;
  }>;
}