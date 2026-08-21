import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IMessageService } from "../../interfaces/chat/IMessageService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IMessageRepository } from "../../../repositories/interfaces/chat/IMessageRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IMessageReceiptRepository } from "../../../repositories/interfaces/chat/IMessageReceiptRepository";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/program/IUserPlanRepository";

import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { ISocketService } from "../../interfaces/socket/ISocketService";

import { MessageMapper } from "../../../mapper/chat/message.mapper";

import { MessageType } from "../../../models/message.model";
import { ReceiptStatus } from "../../../models/messageReceipt.model";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";
import { decodeCursor } from "../../../utils/cursor.util";

import logger from "../../../utils/logger";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository,

    @inject(TYPES.IMessageRepository)
    private readonly _messageRepository: IMessageRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _conversationMemberRepository: IConversationMemberRepository,

    @inject(TYPES.ISocketService)
    private readonly _socketService: ISocketService,

    @inject(TYPES.IMessageReceiptRepository)
    private readonly _messageReceiptRepository: IMessageReceiptRepository,

    @inject(TYPES.IUserPlanRepository)
    private readonly _userPlanRepository: IUserPlanRepository,
  ) {}

  private async validateCoachingAuthorization(
    conversationId: string,
    senderId: string,
  ): Promise<void> {
    const conversation =
      await this._conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new CustomError("Conversation not found", StatusCode.NOT_FOUND);
    }

    if (conversation.status !== "active") {
      throw new CustomError("Conversation is not active", StatusCode.FORBIDDEN);
    }

    const member = await this._conversationMemberRepository.findMember(
      conversationId,
      senderId,
    );

    if (!member || member.status !== "active") {
      logger.warn("Unauthorized message send attempt", {
        conversationId,
        senderId,
      });
      throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
    }

    if (conversation.chatType === "direct") {
      const members =
        await this._conversationMemberRepository.findByConversationId(
          conversationId,
        );

      const otherMember = members.find(
        (m) => m.userId.toString() !== senderId && m.status === "active",
      );

      if (otherMember) {
        const activePlan1 =
          await this._userPlanRepository.findActiveByUserAndNutritionist(
            senderId,
            otherMember.userId.toString(),
          );
        const activePlan2 =
          await this._userPlanRepository.findActiveByUserAndNutritionist(
            otherMember.userId.toString(),
            senderId,
          );

        if (!activePlan1 && !activePlan2) {
          logger.warn("Expired or missing coaching plan for messaging", {
            conversationId,
            senderId,
            otherUserId: otherMember.userId.toString(),
          });
          throw new CustomError(
            "Your coaching plan has expired. Messaging is unavailable.",
            StatusCode.FORBIDDEN,
          );
        }
      }
    }
  }

  async sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO> {
    logger.info("Attempting to send message", {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      messageType: dto.messageType,
    });

    if (
      !dto.text?.trim() &&
      (!dto.attachments || dto.attachments.length === 0)
    ) {
      throw new CustomError("Message content required", StatusCode.BAD_REQUEST);
    }

    await this.validateCoachingAuthorization(dto.conversationId, dto.senderId);

    const createdMessage = await this._messageRepository.create({
      conversationId: new Types.ObjectId(dto.conversationId),

      senderId: new Types.ObjectId(dto.senderId),

      text: dto.text,

      attachments: dto.attachments,

      messageType: dto.messageType,

      status: "active",
    });

    logger.debug("Message created", {
      messageId: createdMessage._id.toString(),
      conversationId: dto.conversationId,
    });

    await this._conversationRepository.updateById(dto.conversationId, {
      lastMessageId: createdMessage._id,
      lastActivityAt: createdMessage.createdAt,
      lastMessagePreview: createdMessage.text || "📎 Attachment",
      lastMessageSenderId: createdMessage.senderId,
    });

    const members =
      await this._conversationMemberRepository.findByConversationId(
        dto.conversationId,
      );

    const recipients = members.filter(
      (conversationMember) =>
        conversationMember.status === "active" &&
        conversationMember.userId.toString() !== dto.senderId,
    );

    for (const recipient of recipients) {
      await this._messageReceiptRepository.create({
        conversationId: new Types.ObjectId(dto.conversationId),

        messageId: createdMessage._id,

        userId: recipient.userId,

        status: ReceiptStatus.SENT,
      });
    }

    for (const recipient of recipients) {
      await this._conversationMemberRepository.incrementUnread(
        dto.conversationId,
        recipient.userId.toString(),
      );
    }

    const responseDTO = MessageMapper.toResponseDTO(createdMessage);

    process.nextTick(() => {
      this._socketService.emitNewMessage(dto.conversationId, responseDTO);
    });

    logger.info("Message sent successfully", {
      messageId: responseDTO.id,
      conversationId: dto.conversationId,
      senderId: dto.senderId,
    });

    return responseDTO;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<MessageResponseDTO>> {
    logger.debug("Fetching conversation messages", {
      conversationId,
      userId,
      limit,
      hasCursor: Boolean(cursor),
    });

    const member = await this._conversationMemberRepository.findMember(
      conversationId,
      userId,
    );

    if (!member || member.status !== "active") {
      throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
    }

    const decodedCursor = decodeCursor(cursor);

    const result = await this._messageRepository.findMessagesByConversation(
      conversationId,
      limit,
      decodedCursor ?? undefined,
    );

    const items = result.items.map(MessageMapper.toResponseDTO).reverse();

    logger.debug("Messages fetched", {
      conversationId,
      count: items.length,
      hasMore: result.hasMore,
    });

    return {
      items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    };
  }


  async sendFile(dto: {
    conversationId: string;
    senderId: string;
    file?: Express.Multer.File;
  }): Promise<MessageResponseDTO> {
    logger.info("File message request received", {
      conversationId: dto.conversationId,
      senderId: dto.senderId,
    });

    if (!dto.file) {
      throw new CustomError("File is required", StatusCode.BAD_REQUEST);
    }

    const file = dto.file;

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
    logger.info("Marking conversation as seen", {
      conversationId,
      userId,
    });

    await this._messageReceiptRepository.markConversationAsSeen(
      conversationId,
      userId,
    );

    await this._conversationMemberRepository.resetUnread(
      conversationId,
      userId,
    );

    this._socketService.emitMessagesRead(conversationId, userId);

    logger.info("Conversation marked as seen", {
      conversationId,
      userId,
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    logger.info("Delete message request", {
      messageId,
      userId,
    });

    const message = await this._messageRepository.findById(messageId);

    if (!message) {
      throw new CustomError("Message not found", StatusCode.NOT_FOUND);
    }

    if (message.senderId.toString() !== userId) {
      throw new CustomError("Unauthorized delete", StatusCode.FORBIDDEN);
    }

    await this._messageRepository.deleteById(messageId);

    this._socketService.emitMessageDeleted(
      message.conversationId.toString(),
      messageId,
    );

    logger.info("Message deleted", {
      messageId,
      conversationId: message.conversationId.toString(),
    });
  }

  async editMessage(
    messageId: string,
    text: string,
    userId: string,
  ): Promise<MessageResponseDTO> {
    logger.info("Edit message request", {
      messageId,
      userId,
    });

    if (!text.trim()) {
      throw new CustomError(
        "Message text cannot be empty",
        StatusCode.BAD_REQUEST,
      );
    }

    const message = await this._messageRepository.findById(messageId);

    if (!message) {
      throw new CustomError("Message not found", StatusCode.NOT_FOUND);
    }

    if (message.senderId.toString() !== userId) {
      throw new CustomError("Unauthorized edit", StatusCode.FORBIDDEN);
    }

    await this._messageRepository.updateById(messageId, {
      text: text.trim(),
      status: "edited",
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
      text.trim(),
    );

    logger.info("Message edited successfully", {
      messageId,
      conversationId: updatedMessage.conversationId.toString(),
    });

    return responseDTO;
  }
}
