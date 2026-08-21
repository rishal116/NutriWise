import { Request, Response } from "express";
import { IMessageController } from "../../interfaces/chat/IMessageController";
import { IMessageService } from "../../../services/interfaces/chat/IMessageService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject(TYPES.IMessageService)
    private _messageService: IMessageService,
  ) {}

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId, text, messageType, attachments } = req.body;

    const message = await this._messageService.sendMessage({
      conversationId,
      senderId: req.user?.userId as string,
      text,
      attachments,
      messageType,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      data: message,
    });
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const limit = Number(req.query.limit) || 30;

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const messages = await this._messageService.getMessages(
      conversationId,
      req.user?.userId as string,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: messages,
    });
  });

  sendFile = asyncHandler(async (req: Request, res: Response) => {
    const message = await this._messageService.sendFile({
      conversationId: req.body.conversationId,
      senderId: req.user?.userId as string,
      file: req.file,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      data: message,
    });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    await this._messageService.markAsRead(
      conversationId,
      req.user?.userId as string,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Messages marked as read",
    });
  });

  deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;

    await this._messageService.deleteMessage(
      messageId,
      req.user?.userId as string,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Message deleted",
    });
  });

  editMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const { text } = req.body;

    const updatedMessage = await this._messageService.editMessage(
      messageId,
      text,
      req.user?.userId as string,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: updatedMessage,
    });
  });
}
