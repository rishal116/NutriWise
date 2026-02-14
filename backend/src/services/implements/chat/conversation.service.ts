import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IConversationService } from "../../interfaces/chat/IConversationService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IConversation } from "../../../models/conversation.model";

@injectable()
export class ConversationService implements IConversationService {

  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepo: IConversationRepository,

    @inject(TYPES.IMessageRepository)
    private _messageRepo: IMessageRepository,

    @inject(TYPES.IUserRepository)
    private _userRepo: IUserRepository
  ) {}

  private generateDirectKey(user1: string, user2: string): string {
    return [user1, user2].sort().join("_");
  }

private mapConversation(
  conversation: IConversation,
  otherUser?: any
): ConversationResponseDTO {
  return {
    id: conversation._id.toString(),
    chatType: conversation.chatType,
    title: conversation.title,
    groupAvatar: conversation.groupAvatar,
    adminId: conversation.adminId?.toString(),
    lastMessageId: conversation.lastMessageId?.toString(),
    lastMessageAt: conversation.lastMessageAt,

    otherUserName: otherUser?.fullName || null,
    otherUserProfile: otherUser?.profileImage || null
  };
}

  async createDirectConversation(
    dto: CreateDirectConversationDTO
  ): Promise<ConversationResponseDTO> {

    const directKey = this.generateDirectKey(
      dto.currentUserId,
      dto.otherUserId
    );

    let conversation =
      await this._conversationRepo.findByDirectKey(directKey);

    if (!conversation) {
      conversation = await this._conversationRepo.create({
        participants: [
          new Types.ObjectId(dto.currentUserId),
          new Types.ObjectId(dto.otherUserId),
        ],
        chatType: "direct",
        directKey,
      });
    }

    const otherUser = await this._userRepo.findById(dto.otherUserId);

    return this.mapConversation(conversation, otherUser);
  }
  
  async getUserConversations(userId: string): Promise<ConversationResponseDTO[]> {
    const conversations = await this._conversationRepo.findUserConversations(userId);
    
    const otherUserIds = [...new Set(conversations
      .filter(c => c.chatType === "direct")
      .map(c =>
        c.participants.find(p => p.toString() !== userId)?.toString()
      )
      .filter(Boolean)
    )] as string[];


    const users = await this._userRepo.findByIds(otherUserIds);
    const userMap = new Map(
      users.map(u => [u._id.toString(), u])
    );
    return conversations.map((c) => {
      let otherUser = undefined;
      if (c.chatType === "direct") {
        const otherId = c.participants.find(
          p => p.toString() !== userId
        )?.toString();
        if (otherId) {
          otherUser = userMap.get(otherId);
        }
      }
      return this.mapConversation(c, otherUser);
    });
  }
}

