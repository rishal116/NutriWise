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
  GroupListResponseDto,
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
  ) { }

  async createGroup(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<IConversation> {
    logger.info("Create group initiated", {
      userId,
      title: data.title,
    });

    if (!Types.ObjectId.isValid(userId)) {
      logger.warn("Invalid user ID during group creation", { userId });
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!data.title || data.title.trim().length < 3) {
      logger.warn("Invalid group title provided", {
        userId,
        title: data.title,
      });

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
        groupId: group._id.toString(),
        userId,
      });

      return group;
    } catch (error) {
      logger.error("Failed to create group", {
        userId,
        title: data.title,
        error,
      });

      throw error;
    }
  }

async getMyGroups(
  userId: string,
  role: "user" | "nutritionist",
  limit = 10,
  cursor?: {
    lastMessageAt: string;
    id: string;
  },
): Promise<GroupListResponseDto> {
  logger.info("Fetching user groups", {
    userId,
    role,
    limit,
    cursor,
  });

  if (!Types.ObjectId.isValid(userId)) {
    logger.warn("Invalid user ID while fetching groups", {
      userId,
    });

    throw new CustomError(
      "Invalid user ID",
      StatusCode.BAD_REQUEST,
    );
  }

  try {
    const safeLimit = Math.min(
      Math.max(limit, 1),
      50,
    );

    const memberships =
      await this._memberRepo.findByUser(
        userId,
        role,
      );

    if (!memberships.length) {
      logger.info(
        "No memberships found for user",
        {
          userId,
        },
      );

      return {
        groups: [],
        pagination: {
          hasMore: false,
          nextCursor: null,
        },
      };
    }

    const groupIds = memberships.map(
      (membership) =>
        membership.conversationId.toString(),
    );

    const groups =
      await this._conversationRepo.findUserConversationsPaginated(
        groupIds,
        safeLimit,
        cursor,
      );

    const filteredGroups = groups.filter(
      (group) => group.chatType === "group",
    );

    const hasMore =
      filteredGroups.length > safeLimit;

    if (hasMore) {
      filteredGroups.pop();
    }

    const memberCountMap =
      await this._memberRepo.getMemberCounts(
        groupIds,
      );

    const mappedGroups = filteredGroups.map(
      (group) =>
        GroupMapper.toDto(
          group,
          memberCountMap[
            group._id.toString()
          ] || 0,
        ),
    );

    const lastGroup =
      filteredGroups[
        filteredGroups.length - 1
      ];

    const nextCursor =
      hasMore && lastGroup?.lastMessageAt
        ? {
            lastMessageAt:
              lastGroup.lastMessageAt.toISOString(),
            id: lastGroup._id.toString(),
          }
        : null;

    logger.info(
      "User groups fetched successfully",
      {
        userId,
        totalGroups: mappedGroups.length,
        hasMore,
      },
    );

    return {
      groups: mappedGroups,
      pagination: {
        hasMore,
        nextCursor,
      },
    };
  } catch (error) {
    logger.error(
      "Failed to fetch user groups",
      {
        userId,
        role,
        error,
      },
    );

    throw error;
  }
}

  async getGroupDetails(groupId: string): Promise<GroupDetailsDto> {
    logger.info("Fetching group details", { groupId });

    if (!Types.ObjectId.isValid(groupId)) {
      logger.warn("Invalid group ID while fetching details", { groupId });
      throw new CustomError("Invalid group ID", StatusCode.BAD_REQUEST);
    }

    try {
      const group = await this._conversationRepo.findById(groupId);

      if (!group || group.chatType !== "group") {
        logger.warn("Group not found", { groupId });
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
            profileImage: u.profileImageUrl,
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

      logger.info("Group details fetched successfully", {
        groupId,
        memberCount: memberList.length,
      });

      return {
        id: group._id.toString(),
        title: group.title,
        description: group.description,
        memberCount: group.memberCount,
        members: memberList,
        visibility: group.visibility ?? "public",
      };
    } catch (error) {
      logger.error("Failed to fetch group details", {
        groupId,
        error,
      });

      throw error;
    }
  }

  async getJoinRequests(groupId: string): Promise<JoinRequestDto[]> {
    logger.info("Fetching join requests", { groupId });

    if (!Types.ObjectId.isValid(groupId)) {
      logger.warn("Invalid group ID while fetching join requests", { groupId });
      throw new CustomError("Invalid group ID", StatusCode.BAD_REQUEST);
    }

    try {
      const requests =
        await this._joinRequestRepo.findPendingByConversation(groupId);

      if (!requests.length) {
        logger.info("No join requests found", { groupId });
        return [];
      }

      const userIds = requests.map((r) => r.userId.toString());

      const users = await this._userRepo.findByIds(userIds);

      const userMap = new Map(
        users.map((u) => [
          u._id.toString(),
          {
            name: u.fullName,
            profileImage: u.profileImageUrl,
          },
        ]),
      );

      logger.info("Join requests fetched successfully", {
        groupId,
        requestCount: requests.length,
      });

      return requests.map((r) => {
        const user = userMap.get(r.userId.toString());

        return JoinRequestMapper.toDto(
          r,
          user?.name || "Unknown",
          user?.profileImage || null,
        );
      });
    } catch (error) {
      logger.error("Failed to fetch join requests", {
        groupId,
        error,
      });

      throw error;
    }
  }

  async acceptRequest(groupId: string, userId: string) {
    logger.info("Accepting join request", {
      groupId,
      userId,
    });

    if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
      logger.warn("Invalid IDs while accepting request", {
        groupId,
        userId,
      });

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
        logger.warn("User already exists in group", {
          groupId,
          userId,
        });

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

      logger.info("Join request accepted successfully", {
        groupId,
        userId,
      });
    } catch (error) {
      logger.error("Failed to accept join request", {
        groupId,
        userId,
        error,
      });

      throw error;
    } finally {
      session.endSession();
    }
  }

  async rejectRequest(groupId: string, userId: string) {
    logger.info("Rejecting join request", {
      groupId,
      userId,
    });

    if (!Types.ObjectId.isValid(groupId) || !Types.ObjectId.isValid(userId)) {
      logger.warn("Invalid IDs while rejecting request", {
        groupId,
        userId,
      });

      throw new CustomError("Invalid IDs", StatusCode.BAD_REQUEST);
    }

    try {
      await this._joinRequestRepo.updateStatus(groupId, userId, "rejected");

      logger.info("Join request rejected successfully", {
        groupId,
        userId,
      });
    } catch (error) {
      logger.error("Failed to reject join request", {
        groupId,
        userId,
        error,
      });

      throw error;
    }
  }
}