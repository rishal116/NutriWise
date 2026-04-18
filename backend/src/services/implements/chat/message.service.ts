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
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IMessageReceiptRepository } from "../../../repositories/interfaces/chat/IMessageReceiptRepository";
import { ReceiptStatus } from "../../../models/messageReceipt.model";
import { MessageType } from "../../../models/message.model";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads";
import { RoleContext } from "../../../models/conversationMember.model";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepository: IConversationRepository,

    @inject(TYPES.IMessageRepository)
    private _messageRepository: IMessageRepository,

    @inject(TYPES.IConversationMemberRepository)
    private _conversationMemberRepository: IConversationMemberRepository,

    @inject(TYPES.ISocketService)
    private _socketService: ISocketService,

    @inject(TYPES.IMessageReceiptRepository)
    private _messagereceiptrepo: IMessageReceiptRepository,

    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
  ) {}

  async sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO> {
    logger.info("Attempting to send message", {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      type: dto.messageType,
    });
    if (!dto.text && (!dto.attachments || dto.attachments.length === 0)) {
      throw new CustomError("Message content required", StatusCode.BAD_REQUEST);
    }
    const conversation = await this._conversationRepository.findById(
      dto.conversationId,
    );
    if (!conversation) {
      logger.warn("Conversation not found while sending message", {
        conversationId: dto.conversationId,
        senderId: dto.senderId,
      });
      throw new CustomError("Conversation not found", StatusCode.NOT_FOUND);
    }
    const member = await this._conversationMemberRepository.findMember(
      dto.conversationId,
      dto.senderId,
      dto.context,
    );
    if (!member || member.status !== "active") {
      logger.warn("Unauthorized message send attempt", {
        conversationId: dto.conversationId,
        senderId: dto.senderId,
      });
      throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
    }
    const createdMessage = await this._messageRepository.create({
      conversationId: new Types.ObjectId(dto.conversationId),
      senderId: new Types.ObjectId(dto.senderId),
      text: dto.text,
      attachments: dto.attachments,
      messageType: dto.messageType,
    });
    logger.debug("Message created in DB", {
      messageId: createdMessage._id.toString(),
      conversationId: dto.conversationId,
    });
    await this._conversationRepository.updateById(dto.conversationId, {
      lastMessageId: createdMessage._id,
      lastMessageAt: createdMessage.createdAt,
      lastMessagePreview: createdMessage.text || "📎 Attachment",
      lastMessageSenderId: createdMessage.senderId,
    });
    const members =
      await this._conversationMemberRepository.findByConversationId(
        dto.conversationId,
      );
    for (const m of members) {
      if (m.userId.toString() === dto.senderId) continue;

      await this._messagereceiptrepo.create({
        conversationId: new Types.ObjectId(dto.conversationId),
        messageId: createdMessage._id,
        userId: m.userId,
        status: "sent" as ReceiptStatus,
      });
    }
    const responseDTO = MessageMapper.toResponseDTO(createdMessage);
    process.nextTick(() => {
      this._socketService.emitNewMessage(dto.conversationId, responseDTO);
    });

    await Promise.all(
      members
        .filter((m) => m.userId.toString() !== dto.senderId)
        .map((m) =>
          this._conversationMemberRepository.incrementUnreadForGroup(
            dto.conversationId,
            m.userId.toString(),
          ),
        ),
    );
    logger.info("Message sent successfully", {
      messageId: responseDTO.id,
      conversationId: dto.conversationId,
      senderId: dto.senderId,
    });
    return responseDTO;
  }

  async getMessages(conversationId: string, limit = 20, cursor?: string) {
    const messages =
      await this._messageRepository.findMessagesByConversationPaginated(
        conversationId,
        limit,
        cursor,
      );

    const senderIds = [...new Set(messages.map((m) => m.senderId.toString()))];

    const users = await this._userRepository.findByIds(senderIds);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return messages.map((msg) => {
      const user = userMap.get(msg.senderId.toString());

      return {
        ...MessageMapper.toResponseDTO(msg),

        senderFullName: user?.fullName ?? "Unknown",
        senderProfileImage: user?.profileImage ?? null,
      };
    });
  }

  async sendFile(dto: {
    conversationId: string;
    senderId: string;
    context: RoleContext;
    file?: Express.Multer.File;
  }): Promise<MessageResponseDTO> {
    logger.info("File message request received", {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
    });

    if (!dto.file) {
      logger.warn("File message failed - file missing", {
        conversationId: dto.conversationId,
        senderId: dto.senderId,
      });

      throw new CustomError("File is required", StatusCode.BAD_REQUEST);
    }

    const file: Express.Multer.File = dto.file;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new CustomError("Unsupported file type", StatusCode.BAD_REQUEST);
    }

    const fileUrl = await uploadToCloudinary(file, "chat-files");

    return this.sendMessage({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      context: dto.context,
      attachments: [
        {
          url: fileUrl,
          fileName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        },
      ],
      messageType: MessageType.FILE,
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    logger.info("Marking messages as read", {
      conversationId,
      userId,
    });
    const messages =
      await this._messageRepository.findMessagesByConversation(conversationId);
    await Promise.all(
      messages.map((msg) =>
        this._messagereceiptrepo.updateStatus(
          msg._id.toString(),
          userId,
          "seen",
        ),
      ),
    );
    this._socketService.emitMessagesRead(conversationId, userId);
    logger.info("Messages marked as read", {
      conversationId,
      userId,
      total: messages.length,
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    logger.info("Delete message request", { messageId, userId });
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      logger.warn("Delete failed - message not found", { messageId });
      throw new CustomError("Message not found", StatusCode.NOT_FOUND);
    }
    if (message.senderId.toString() !== userId) {
      logger.warn("Unauthorized delete attempt", {
        messageId,
        userId,
      });
      throw new CustomError("Unauthorized delete", StatusCode.FORBIDDEN);
    }
    await this._messageRepository.updateById(messageId, {
      isDeleted: true,
    });
    this._socketService.emitMessageDeleted(
      message.conversationId.toString(),
      messageId,
    );
    logger.info("Message deleted", {
      messageId,
      conversationId: message.conversationId,
    });
  }

  async editMessage(
    messageId: string,
    text: string,
    userId: string,
  ): Promise<MessageResponseDTO> {
    logger.info("Edit message request", { messageId, userId });
    const message = await this._messageRepository.findById(messageId);
    if (!message) {
      logger.warn("Edit failed - message not found", { messageId });
      throw new CustomError("Message not found", StatusCode.NOT_FOUND);
    }
    if (message.senderId.toString() !== userId) {
      logger.warn("Unauthorized edit attempt", { messageId, userId });
      throw new CustomError("Unauthorized edit", StatusCode.FORBIDDEN);
    }
    await this._messageRepository.updateById(messageId, {
      text,
      isEdited: true,
      editedAt: new Date(),
    });
    const updatedMessage = await this._messageRepository.findById(messageId);
    if (!updatedMessage) {
      throw new CustomError(
        "Message not found after update",
        StatusCode.NOT_FOUND,
      );
    }
    const responseDTO = MessageMapper.toResponseDTO(updatedMessage);
    this._socketService.emitMessageEdited(
      updatedMessage.conversationId.toString(),
      messageId,
      text,
    );
    logger.info("Message edited successfully", {
      messageId,
      conversationId: updatedMessage.conversationId,
    });
    return responseDTO;
  }
}
