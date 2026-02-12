import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IMessageService } from "../../interfaces/chat/IMessageService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";
import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { getIO } from "../../../infrastructures/socket/socket.server";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepo: IConversationRepository,
    
    @inject(TYPES.IMessageRepository)
    private _messageRepo: IMessageRepository,

    @inject(TYPES.IUserRepository)
    private _userRepo: IUserRepository
  ) {}
  

private mapMessage(message: any): MessageResponseDTO {
  return {
    id: message._id.toString(),
    conversationId: message.conversationId.toString(),
    senderId: message.senderId.toString(),
    content: message.text,
    mediaUrl: message.fileUrl,
    type: message.messageType,
    createdAt: message.createdAt,
  };
}


async sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO> {
  const conversation = await this._conversationRepo.findById(dto.conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === dto.senderId
  );

  if (!isParticipant) {
    throw new Error("Not authorized");
  }

  const message = await this._messageRepo.create({
    conversationId: new Types.ObjectId(dto.conversationId),
    senderId: new Types.ObjectId(dto.senderId),
    text: dto.text,
    fileUrl: dto.fileUrl,
    messageType: dto.messageType,
    readBy: [new Types.ObjectId(dto.senderId)],
  });


  const mappedMessage = this.mapMessage(message);


  const io = getIO();
  io.to(dto.conversationId).emit("receiveMessage", mappedMessage);


  await this._conversationRepo.updateById(dto.conversationId, {
    lastMessageId: message._id,
    lastMessageAt: new Date(),
  });

  return mappedMessage;
}





  async getMessages(
    conversationId: string,
  ): Promise<MessageResponseDTO[]> {

    const messages =
      await this._messageRepo.findMessagesByConversation(
        conversationId,
      );
      

    return messages.map(m => this.mapMessage(m));
  }
}
