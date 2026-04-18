import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IConversationService } from "../../interfaces/chat/IConversationService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { Types } from "mongoose";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import logger from "../../../utils/logger";
import { ConversationMapper } from "../../../mapper/chat/conversation.mapper";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";
import { IConversationMember } from "../../../models/conversationMember.model";

@injectable()
export class ConversationService implements IConversationService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepo: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private _conversationMemberRepo: IConversationMemberRepository,

    @inject(TYPES.IUserRepository)
    private _userRepo: IUserRepository,

    @inject(TYPES.IMessageRepository)
    private _messageRepo: IMessageRepository,
  ) {}

  private generateDirectKey(user1: string, user2: string): string {
    return [user1, user2].sort().join("_");
  }
  async createDirectConversation(
    dto: CreateDirectConversationDTO,
  ): Promise<ConversationResponseDTO> {
    logger.info("Create direct conversation requested", {
      currentUserId: dto.currentUserId,
      otherUserId: dto.otherUserId,
      context: dto.context,
    });

    if (
      !Types.ObjectId.isValid(dto.currentUserId) ||
      !Types.ObjectId.isValid(dto.otherUserId)
    ) {
      throw new Error("Invalid user IDs");
    }

    if (dto.currentUserId === dto.otherUserId) {
      throw new Error("Cannot create chat with yourself");
    }

    const directKey = this.generateDirectKey(
      dto.currentUserId,
      dto.otherUserId,
    );

    let conversation = await this._conversationRepo.findByDirectKey(directKey);

    const currentContext = dto.context;
    const otherContext = currentContext === "user" ? "nutritionist" : "user";

    if (!conversation) {
      logger.debug("No existing conversation found. Creating new one", {
        directKey,
      });

      conversation = await this._conversationRepo.create({
        chatType: "direct",
        directKey,
      });

      console.log(currentContext);

      await this._conversationMemberRepo.createMany([
        {
          conversationId: conversation._id,
          userId: new Types.ObjectId(dto.currentUserId),
          role: "member",
          roleContext: currentContext,
        },
        {
          conversationId: conversation._id,
          userId: new Types.ObjectId(dto.otherUserId),
          role: "member",
          roleContext: otherContext,
        },
      ]);
    } else {
      const existingMembers =
        await this._conversationMemberRepo.findByConversationId(
          conversation._id.toString(),
        );
      const currentExists = existingMembers.find(
        (m) => m.userId.toString() === dto.currentUserId,
      );

      const otherExists = existingMembers.find(
        (m) => m.userId.toString() === dto.otherUserId,
      );

      const membersToCreate: Partial<IConversationMember>[] = [];

      if (!currentExists) {
        membersToCreate.push({
          conversationId: conversation._id,
          userId: new Types.ObjectId(dto.currentUserId),
          role: "member",
          roleContext: currentContext,
        });
      }

      if (!otherExists) {
        membersToCreate.push({
          conversationId: conversation._id,
          userId: new Types.ObjectId(dto.otherUserId),
          role: "member",
          roleContext: otherContext,
        });
      }

      if (membersToCreate.length > 0) {
        logger.debug("Adding missing conversation members", {
          count: membersToCreate.length,
        });

        await this._conversationMemberRepo.createMany(membersToCreate);
      }
    }

    const otherUser = await this._userRepo.findById(dto.otherUserId);

    return ConversationMapper.toResponseDTO(conversation, otherUser);
  }

  async getUserConversations(
    userId: string,
    context: "user" | "nutritionist",
    cursor: string | undefined,
    limit: number,
  ): Promise<{
    data: ConversationResponseDTO[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    logger.debug("Fetching user conversations", { userId });

    const members = await this._conversationMemberRepo.findByUser(
      userId,
      context,
    );

    const conversationIds = members.map((m) => m.conversationId.toString());

    if (conversationIds.length === 0) {
      return {
        data: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const conversations =
      await this._conversationRepo.findUserConversationsPaginated(
        conversationIds,
        limit,
        cursor,
      );

    const hasMore = conversations.length > limit;

    const paginated = hasMore ? conversations.slice(0, limit) : conversations;

    const nextCursor =
      hasMore && paginated.length > 0
        ? (paginated[paginated.length - 1].lastMessageAt?.toISOString() ?? null)
        : null;

    if (paginated.length === 0) {
      return {
        data: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const conversationMembers =
      await this._conversationMemberRepo.findByConversationIds(
        paginated.map((c) => c._id.toString()),
      );

    const memberMap = new Map<string, typeof conversationMembers>();

    for (const m of conversationMembers) {
      const key = m.conversationId.toString();

      if (!memberMap.has(key)) {
        memberMap.set(key, []);
      }

      memberMap.get(key)!.push(m);
    }

    const otherMemberIds = conversationMembers
      .filter((m) => m.userId.toString() !== userId)
      .map((m) => m.userId.toString());

    const users = await this._userRepo.findByIds(otherMemberIds);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const lastMessageIds = paginated
      .map((c) => c.lastMessageId?.toString())
      .filter(Boolean) as string[];

    const messages = await this._messageRepo.findByIds(lastMessageIds);

    const messageMap = new Map(messages.map((m) => [m._id.toString(), m]));

    const data = paginated.map((conversation) => {
      const membersOfConversation =
        memberMap.get(conversation._id.toString()) ?? [];

      let otherUser = null;

      if (conversation.chatType === "direct") {
        const otherMember = membersOfConversation.find(
          (m) => m.userId.toString() !== userId,
        );

        if (otherMember) {
          otherUser = userMap.get(otherMember.userId.toString()) ?? null;
        }
      }

      const lastMsg = conversation.lastMessageId
        ? messageMap.get(conversation.lastMessageId.toString())
        : null;

      const lastMessageText =
        lastMsg?.text ??
        (lastMsg?.messageType === "file"
          ? `📎 ${lastMsg.attachments?.[0]?.fileName ?? "Attachment"}`
          : null);

      return ConversationMapper.toResponseDTO(
        conversation,
        otherUser,
        lastMessageText,
        membersOfConversation.length,
      );
    });

    return {
      data,
      nextCursor,
      hasMore,
    };
  }
}
