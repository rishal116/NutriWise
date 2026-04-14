import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserGroupService } from "../../interfaces/user/IUserGroupService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { GroupDto } from "../../../dtos/user/group.dto";

@injectable()
export class UserGroupService implements IUserGroupService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepository: IConversationRepository,
    @inject(TYPES.IConversationMemberRepository)
    private _conversationMemberRepo: IConversationMemberRepository,
  ) {}

  async getGroups(userId: string, limit: number, skip: number) {
    const groups = await this._conversationRepository.findGroups(limit, skip);

    const groupIds = groups.map((g) => g._id.toString());

    const members =
      await this._conversationMemberRepo.findByConversationIds(groupIds);

    const memberCountMap = new Map<string, number>();

    members.forEach((m) => {
      const key = m.conversationId.toString();
      memberCountMap.set(key, (memberCountMap.get(key) || 0) + 1);
    });

    const userMemberships = await this._conversationMemberRepo.findByUser(
      userId,
      "user",
    );

    const joinedSet = new Set(
      userMemberships.map((m) => m.conversationId.toString()),
    );

    const mappedGroups: GroupDto[] = groups.map((group) => {
      const id = group._id.toString();

      return {
        id,
        title: group.title ?? "Untitled Group",
        description: group.description ?? "",
        visibility: group.visibility ?? "public",
        memberCount: memberCountMap.get(id) || 0,
        isJoined: joinedSet.has(id),
        createdAt: group.createdAt,
      };
    });

    const total = await this._conversationRepository.countGroups();

    return {
      groups: mappedGroups,
      total,
    };
  }
}
