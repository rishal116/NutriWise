import { ClientSession, Types } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IConversationService } from "../../interfaces/chat/IConversationService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/program/IUserPlanRepository";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { ConversationMapper } from "../../../mapper/chat/conversation.mapper";
import { decodeCursor } from "../../../utils/cursor.util";
import { buildDirectKey } from "../../../utils/chat.util";
import logger from "../../../utils/logger";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class ConversationService implements IConversationService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _conversationMemberRepository: IConversationMemberRepository,

    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.IUserPlanRepository)
    private readonly _userPlanRepository: IUserPlanRepository,
  ) {}

  async createDirectConversation(
    dto: CreateDirectConversationDTO,
  ): Promise<ConversationResponseDTO> {
    return this.createDirectConversationInternal(dto);
  }

  async createDirectConversationWithSession(
    dto: CreateDirectConversationDTO,
    session: ClientSession,
  ): Promise<ConversationResponseDTO> {
    return this.createDirectConversationInternal(dto, session);
  }

  private async createDirectConversationInternal(
    dto: CreateDirectConversationDTO,
    session?: ClientSession,
  ): Promise<ConversationResponseDTO> {
    if (dto.currentUserId === dto.otherUserId) {
      throw new Error("Cannot create a conversation with yourself.");
    }

    const currentUserId = new Types.ObjectId(dto.currentUserId);
    const otherUserId = new Types.ObjectId(dto.otherUserId);

    const directKey = buildDirectKey(currentUserId, otherUserId);

    let conversation =
      await this._conversationRepository.findByDirectKey(directKey);

    if (!conversation) {
      const activePlan1 =
        await this._userPlanRepository.findActiveByUserAndNutritionist(
          dto.currentUserId,
          dto.otherUserId,
        );
      const activePlan2 =
        await this._userPlanRepository.findActiveByUserAndNutritionist(
          dto.otherUserId,
          dto.currentUserId,
        );

      if (!activePlan1 && !activePlan2) {
        throw new CustomError(
          "Cannot create coaching conversation without an active plan.",
          StatusCode.FORBIDDEN,
        );
      }

      if (session) {
        conversation = await this._conversationRepository.createWithSession(
          {
            chatType: "direct",
            directKey,
            purpose: "coaching",
            status: "active",
          },
          session,
        );

        await this._conversationMemberRepository.createManyWithSession(
          [
            {
              conversationId: conversation._id,
              userId: currentUserId,
              role: "member",
              status: "active",
            },
            {
              conversationId: conversation._id,
              userId: otherUserId,
              role: "member",
              status: "active",
            },
          ],
          session,
        );
      } else {
        conversation = await this._conversationRepository.create({
          chatType: "direct",
          directKey,
          purpose: "coaching",
          status: "active",
        });

        await this._conversationMemberRepository.createMany([
          {
            conversationId: conversation._id,
            userId: currentUserId,
            role: "member",
            status: "active",
          },
          {
            conversationId: conversation._id,
            userId: otherUserId,
            role: "member",
            status: "active",
          },
        ]);
      }

      logger.info("Direct conversation created", {
        conversationId: conversation._id.toString(),
      });
    }

    const otherUser = await this._userRepository.findById(dto.otherUserId);

    if (!otherUser) {
      throw new Error("Conversation participant not found.");
    }

    return ConversationMapper.toResponseDTO(
      conversation,
      otherUser,
      0,
      false,
      false,
    );
  }

  async getUserConversations(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<ConversationResponseDTO>> {
    logger.debug("Fetching user conversations", {
      userId,
      limit,
      hasCursor: Boolean(cursor),
    });

    const members = await this._conversationMemberRepository.findByUser(userId);

    if (members.length === 0) {
      return new InfiniteScrollResponseDTO([], null, false);
    }

    const decodedCursor = decodeCursor(cursor);

    const conversationResult =
      await this._conversationRepository.findUserConversations(
        userId,
        limit,
        decodedCursor ?? undefined,
      );

    if (conversationResult.items.length === 0) {
      return new InfiniteScrollResponseDTO([], null, false);
    }

    const conversations = conversationResult.items;

    const conversationIds = conversations.map((conversation) =>
      conversation._id.toString(),
    );

    const conversationMembers =
      await this._conversationMemberRepository.findByConversationIds(
        conversationIds,
      );

    const otherUserIds = conversationMembers
      .filter(
        (member) =>
          member.userId.toString() !== userId && member.status === "active",
      )
      .map((member) => member.userId.toString());

    const users = await this._userRepository.findByIds(otherUserIds);

    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    const currentMemberMap = new Map(
      members.map((member) => [member.conversationId.toString(), member]),
    );

    const items = conversations.map((conversation) => {
      const conversationId = conversation._id.toString();

      const currentMember = currentMemberMap.get(conversationId);

      let otherUser = null;

      if (conversation.chatType === "direct") {
        const otherMember = conversationMembers.find(
          (member) =>
            member.conversationId.toString() === conversationId &&
            member.userId.toString() !== userId &&
            member.status === "active",
        );

        if (otherMember) {
          otherUser = userMap.get(otherMember.userId.toString()) ?? null;
        }
      }

      return ConversationMapper.toResponseDTO(
        conversation,
        otherUser,
        currentMember?.unreadCount ?? 0,
        currentMember?.isMuted ?? false,
        currentMember?.isArchived ?? false,
      );
    });

    logger.info("User conversations loaded", {
      userId,
      count: items.length,
      hasMore: conversationResult.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      conversationResult.nextCursor,
      conversationResult.hasMore,
    );
  }
}
