import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IMessageService } from "../../interfaces/chat/IMessageService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";
import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { MessageMapper } from "../../../mapper/message.mapper";


@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepository: IConversationRepository,

    @inject(TYPES.IMessageRepository)
    private _messageRepository: IMessageRepository,

    @inject(TYPES.ISocketService)
    private _socketService: ISocketService
  ) {}

  async sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO> {
    logger.info(`sending message ${dto.senderId}`);
    const conversation = await this._conversationRepository.findById(dto.conversationId);
    if (!conversation) {
      logger.warn("Conversation not found");
      throw new CustomError("Conversation not found",StatusCode.NOT_FOUND);
    }
    const isParticipant = conversation.participants.some(
      (participantId: Types.ObjectId) =>
        participantId.toString() === dto.senderId
    );
    if (!isParticipant) {
      logger.warn("Unauthorized message attempt", {conversationId: dto.conversationId,senderId: dto.senderId});
      throw new CustomError("Unauthorized message attempt",StatusCode.NOT_FOUND);
    }
    const createdMessage = await this._messageRepository.create({
      conversationId: new Types.ObjectId(dto.conversationId),
      senderId: new Types.ObjectId(dto.senderId),
      text: dto.text,
      fileUrl: dto.fileUrl,
      messageType: dto.messageType,
      readBy: new Map([[dto.senderId, new Date()]]),
    });
    await this._conversationRepository.updateById(dto.conversationId, {
      lastMessageId: createdMessage._id,
      lastMessageAt: new Date(),
    });
    const responseDTO = MessageMapper.toResponseDTO(createdMessage);
    this._socketService.emitToRoom(dto.conversationId,"receiveMessage",responseDTO);
    logger.info(`Message sent successfully ${responseDTO.id}`);
    return responseDTO;
  }
  
  async getMessages(conversationId: string): Promise<MessageResponseDTO[]> {
    logger.info(`Fetching messages ${conversationId}`);
    
    const messages = await this._messageRepository.findMessagesByConversation(
      conversationId
    );
    return messages.map(MessageMapper.toResponseDTO);
  }

}
