import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";

import { IChatService } from "../../interfaces/chat/IChatService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";

import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

@injectable()
export class ChatService implements IChatService {

  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepo: IConversationRepository,

    @inject(TYPES.IMessageRepository)
    private _messageRepo: IMessageRepository
  ) {}

  private generateConversationKey(user1: string, user2: string): string {
    return [user1, user2].sort().join("_");
  }

  private mapConversation(conversation: any): ConversationResponseDTO {
    return {
      id: conversation._id.toString(),
      participants: conversation.participants.map((p: Types.ObjectId) =>
        p.toString()
      ),
      type: conversation.type,
      lastMessage: conversation.lastMessage?.toString(),
      lastMessageAt: conversation.lastMessageAt,
    };
  }

  private mapMessage(message: any): MessageResponseDTO {
    return {
      id: message._id.toString(),
      conversationId: message.conversation.toString(),
      senderId: message.sender.toString(),
      content: message.content,
      mediaUrl: message.mediaUrl,
      type: message.type,
      createdAt: message.createdAt,
    };
  }

  async createDirectConversation(
    dto: CreateDirectConversationDTO
  ): Promise<ConversationResponseDTO> {

    const key = this.generateConversationKey(
      dto.currentUserId,
      dto.otherUserId
    );

    const existing =
      await this._conversationRepo.findByConversationKey(key);

    if (existing) {
      return this.mapConversation(existing);
    }

    const conversation = await this._conversationRepo.create({
      participants: [
        new Types.ObjectId(dto.currentUserId),
        new Types.ObjectId(dto.otherUserId),
      ],
      type: "direct",
      conversationKey: key,
    });

    return this.mapConversation(conversation);
  }

  async sendMessage(
    dto: SendMessageDTO
  ): Promise<MessageResponseDTO> {

    const message = await this._messageRepo.create({
      conversation: new Types.ObjectId(dto.conversationId),
      sender: new Types.ObjectId(dto.senderId),
      content: dto.content,
      mediaUrl: dto.mediaUrl,
      type: dto.type,
      readBy: [new Types.ObjectId(dto.senderId)],
    });

    await this._conversationRepo.updateById(dto.conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    return this.mapMessage(message);
  }

  async getUserConversations(
    userId: string
  ): Promise<ConversationResponseDTO[]> {

    const conversations =
      await this._conversationRepo.findUserConversations(userId);

    return conversations.map(c => this.mapConversation(c));
  }

  async getMessages(
    conversationId: string,
    page: number,
    limit: number
  ): Promise<MessageResponseDTO[]> {

    const messages =
      await this._messageRepo.findMessagesByConversation(
        conversationId,
        page,
        limit
      );

    return messages.map(m => this.mapMessage(m));
  }
}
