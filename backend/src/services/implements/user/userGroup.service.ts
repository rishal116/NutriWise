import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserGroupService } from "../../interfaces/user/IUserGroupService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IJoinRequestRepository } from "../../../repositories/interfaces/chat/IJoinRequestRepository";
import { GroupDto } from "../../../dtos/user/group.dto";
import logger from "../../../utils/logger";
import { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

type JoinGroupResponse = {
  status: "joined" | "requested";
};

@injectable()
export class UserGroupService implements IUserGroupService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _conversationMemberRepo: IConversationMemberRepository,

    @inject(TYPES.IJoinRequestRepository)
    private readonly _joinRequestRepo: IJoinRequestRepository,
  ) {}
  
  async getGroups(userId: string, limit: number, skip: number) {
    logger.info("Fetching groups", { userId, limit, skip });
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
    const safeLimit = Math.min(limit, 50);
    const groups = await this._conversationRepository.findGroups(
      safeLimit,
      skip,
    );
    const groupIds = groups.map((g) => g._id.toString());
    if (!groupIds.length) {
      return { groups: [], total: 0 };
    }
    const memberCountMap = await this._conversationMemberRepo.getMemberCounts(groupIds);
    const userMemberships = await this._conversationMemberRepo.findByUser(
      userId,
      "user",
    );
    const joinedSet = new Set(userMemberships.map((m) => m.conversationId.toString()));
    const requests = await this._joinRequestRepo.findPendingByUser(
      userId,
      groupIds,
    );
    const requestedSet = new Set(requests.map((r) => r.conversationId.toString()));
    const mappedGroups: GroupDto[] = groups.map((group) => {
      const id = group._id.toString();
      let joinStatus: "none" | "joined" | "requested" = "none";
      if (joinedSet.has(id)) {
        joinStatus = "joined";
      } else if (requestedSet.has(id)) {
        joinStatus = "requested";
      }
      return {
        id,
        title: group.title ?? "Untitled Group",
        description: group.description ?? "",
        visibility: group.visibility ?? "public",
        memberCount: memberCountMap[id] || 0,
        isJoined: joinStatus === "joined",
        joinStatus,
        createdAt: group.createdAt,
      };
    });
    const total = await this._conversationRepository.countGroups();
    return {
      groups: mappedGroups,
      total,
    };
  }
  
  async joinGroup(userId: string, groupId: string): Promise<JoinGroupResponse> {
    logger.info("Join group request", { userId, groupId });
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(groupId)) {
      throw new CustomError("Invalid IDs", StatusCode.BAD_REQUEST);
    }
    const group = await this._conversationRepository.findById(groupId);
    if (!group || group.chatType !== "group") {
      throw new CustomError("Group not found", StatusCode.NOT_FOUND);
    }
    const exists = await this._conversationMemberRepo.exists(
      groupId,
      userId,
      "user",
    );
    if (exists) {
      return { status: "joined" };
    }
    if (group.visibility === "public") {
      try {
        await this._conversationMemberRepo.addMembers(groupId, [
          {
            userId,
            roleContext: "user",
            role: "member",
          },
        ]);
        await this._conversationRepository.incrementMemberCount(groupId, 1);
        return { status: "joined" };
      } catch (error) {
        logger.error("Error joining public group", { error });
        const existsAfter = await this._conversationMemberRepo.exists(
          groupId,
          userId,
          "user",
        );
        if (existsAfter) {
          return { status: "joined" };
        }
        throw error;
      }
    }
    const existingRequest = await this._joinRequestRepo.findUserRequest(
      groupId,
      userId,
    );
    if (existingRequest?.status === "pending") {
      return { status: "requested" };
    }
    await this._joinRequestRepo.createRequest(groupId, userId);
    return { status: "requested" };
  }
  
}
