import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { INutriGroupService } from "../../interfaces/nutritionist/INutriGroupService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IConversation } from "../../../models/conversation.model";
import { Types } from "mongoose";
import {
  GroupDto,
  GroupDetailsDto,
} from "../../../dtos/nutritionist/group.dto";
import { GroupMapper } from "../../../mapper/nutritionist/group.mapper";
import { IJoinRequestRepository } from "../../../repositories/interfaces/chat/IJoinRequestRepository";
import { JoinRequestDto } from "../../../dtos/nutritionist/joinRequest.dto";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { JoinRequestMapper } from "../../../mapper/nutritionist/joinRequest.mapper";
import mongoose from "mongoose";

@injectable()
export class NutriGroupService implements INutriGroupService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _memberRepo: IConversationMemberRepository,

    @inject(TYPES.IJoinRequestRepository)
    private readonly _joinRequestRepo: IJoinRequestRepository,

    @inject(TYPES.IUserRepository)
    private readonly _userRepo: IUserRepository,
  ) {}

  async createGroup(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<IConversation> {
    logger.info("Creating group started", { userId, title: data.title });
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
    if (!data.title || data.title.trim().length < 3) {
      throw new CustomError(
        "Group title must be at least 3 characters",
        StatusCode.BAD_REQUEST,
      );
    }

    try {
      const group = await this._conversationRepo.create({
        chatType: "group",
        title: data.title.trim(),
        admins: [new Types.ObjectId(userId)],
        visibility: data.isPublic ? "public" : "private",
        description: data.description?.trim(),
        memberCount: 1,
      });

      await this._memberRepo.create({
        conversationId: group._id,
        userId: new Types.ObjectId(userId),
        role: "owner",
        roleContext: "nutritionist",
      });

      logger.info("Group created successfully", {
        groupId: group._id,
      });

      return group;
    } catch (error) {
      logger.error("Error creating group", { error });
      throw error;
    }
  }

  async getMyGroups(
    userId: string,
    role: "user" | "nutritionist",
    limit = 10,
    skip = 0,
  ): Promise<GroupDto[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    const safeLimit = Math.min(limit, 50);

    const memberships = await this._memberRepo.findByUser(userId, role);

    if (!memberships.length) return [];

    const groupIds = memberships.map((m) => m.conversationId.toString());

    const groups = await this._conversationRepo.findByIdsPaginated(
      groupIds,
      safeLimit,
      skip,
    );

    const filteredGroups = groups.filter((g) => g.chatType === "group");

    const memberCountMap = await this._memberRepo.getMemberCounts(groupIds);

    return filteredGroups.map((g) =>
      GroupMapper.toDto(g, memberCountMap[g._id.toString()] || 0),
    );
  }

  async getGroupDetails(groupId: string): Promise<GroupDetailsDto> {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new CustomError("Invalid group ID", StatusCode.BAD_REQUEST);
    }

    const group = await this._conversationRepo.findById(groupId);

    if (!group || group.chatType !== "group") {
      throw new CustomError("Group not found", StatusCode.NOT_FOUND);
    }

    const members = await this._memberRepo.findByConversationId(groupId);

    const activeMembers = members.filter((m) => m.status === "active");

    const userIds = activeMembers.map((m) => m.userId.toString());

    const users = await this._userRepo.findByIds(userIds);

    const userMap = new Map(
      users.map((u) => [
        u._id.toString(),
        {
          name: u.fullName,
          profileImage: u.profileImage,
        },
      ]),
    );

    const memberList = activeMembers.map((m) => {
      const user = userMap.get(m.userId.toString());

      return {
        userId: m.userId.toString(),
        name: user?.name || "Unknown",
        profileImage: user?.profileImage || null,
        role: m.role,
      };
    });

    return {
      id: group._id.toString(),
      title: group.title,
      description: group.description,
      memberCount:group.memberCount,
      members: memberList,
      visibility: group.visibility ?? "public"
    };
  }

  async getJoinRequests(groupId: string): Promise<JoinRequestDto[]> {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new CustomError("Invalid group ID", StatusCode.BAD_REQUEST);
    }

    const requests =
      await this._joinRequestRepo.findPendingByConversation(groupId);

    if (!requests.length) return [];

    const userIds = requests.map((r) => r.userId.toString());

    const users = await this._userRepo.findByIds(userIds);

    const userMap = new Map(
      users.map((u) => [
        u._id.toString(),
        {
          name: u.fullName,
          profileImage: u.profileImage,
        },
      ]),
    );

    return requests.map((r) => {
      const user = userMap.get(r.userId.toString());

      return JoinRequestMapper.toDto(
        r,
        user?.name || "Unknown",
        user?.profileImage || null,
      );
    });
  }

  async acceptRequest(groupId: string, userId: string) {
    if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid IDs", StatusCode.BAD_REQUEST);
    }

    const session = await mongoose.startSession();

    try {
      const existingMember = await this._memberRepo.findMember(
        groupId,
        userId,
        "user",
      );

      if (existingMember) {
        throw new CustomError("User already a member", StatusCode.CONFLICT);
      }

      await session.withTransaction(async () => {
        await this._joinRequestRepo.updateStatus(groupId, userId, "accepted");

        await this._memberRepo.addMembers(groupId, [
          {
            userId,
            roleContext: "user",
            role: "member",
          },
        ]);

        await this._conversationRepo.incrementMemberCount(groupId, 1);
      });

      logger.info("Join request accepted", { groupId, userId });
    } catch (error) {
      logger.error("Error accepting request", { error, groupId, userId });
      throw error;
    } finally {
      session.endSession();
    }
  }

  async rejectRequest(groupId: string, userId: string) {
    if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid IDs", StatusCode.BAD_REQUEST);
    }

    await this._joinRequestRepo.updateStatus(groupId, userId, "rejected");

    logger.info("Join request rejected", { groupId, userId });
  }
}
