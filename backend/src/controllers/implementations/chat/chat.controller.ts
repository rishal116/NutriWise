import { Request, Response, NextFunction } from "express";
import { IChatController } from "../../interfaces/chat/IChatController";
import { IChatService } from "../../../services/interfaces/chat/IChatService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject(TYPES.IChatService)
    private _chatService: IChatService
  ) {}

  createDirectConversation = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const conversation =
        await this._chatService.createDirectConversation({
          currentUserId: req.user?.userId as string,
          otherUserId: req.body.otherUserId,
        });

      res.status(201).json(conversation);
    }
  );

  sendMessage = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const message = await this._chatService.sendMessage({
        conversationId: req.body.conversationId,
        senderId: req.user?.userId as string,
        content: req.body.content,
        mediaUrl: req.body.mediaUrl,
        type: req.body.type,
      });

      res.status(201).json(message);
    }
  );

  getUserChats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const conversations =
        await this._chatService.getUserConversations(
          req.user?.userId as string
        );

      res.json(conversations);
    }
  );

  getMessages = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const messages = await this._chatService.getMessages(
        req.params.conversationId,
        page,
        limit
      );

      res.json(messages);
    }
  );
}
