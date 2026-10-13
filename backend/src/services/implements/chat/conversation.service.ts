import { ClientSession, Types } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IConversationService } from "../../interfaces/chat/IConversationService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/program/IUserPlanRepository";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversation-response.dto";
import { ConversationMapper } from "../../../mappers/chat/conversation.mapper";
import { buildDirectKey } from "../../../utils/chat.util";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { toConversationListItemDTO } from "../../../mappers/chat/conversation-list.mapper";
import { ConversationListFilter } from "../../../types/chat/conversation-list.types";
import { ConversationListItemDTO } from "../../../dtos/chat/conversation-list-item.dto";

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
    session?: ClientSession,
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
          session,
        );

      const activePlan2 =
        await this._userPlanRepository.findActiveByUserAndNutritionist(
          dto.otherUserId,
          dto.currentUserId,
          session,
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
    filter: ConversationListFilter = "all",
    search?: string,
  ): Promise<InfiniteScrollResponseDTO<ConversationListItemDTO>> {
    logger.debug("Fetching user conversations", {
      userId,
      limit,
      filter,
      search: search ?? "none",
    });

    const result = await this._conversationRepository.findUserConversations(
      userId,
      limit,
      cursor,
      filter,
      search,
    );

    const items = result.items.map(toConversationListItemDTO);

    logger.debug("User conversations fetched", {
      userId,
      count: items.length,
      hasMore: result.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getUserConversationDetails(
    userId: string,
    conversationId: string,
  ): Promise<ConversationResponseDTO> {
    logger.debug("Fetching conversation details", {
      userId,
      conversationId,
    });

    const conversation =
      await this._conversationRepository.findUserConversationDetails(
        userId,
        conversationId,
      );

    if (!conversation) {
      throw new CustomError("Conversation not found.", StatusCode.NOT_FOUND);
    }

    const result = ConversationMapper.toResponseDTOFromDetails(conversation);

    logger.debug("Conversation details fetched", {
      userId,
      conversationId,
    });

    return result;
  }
}
