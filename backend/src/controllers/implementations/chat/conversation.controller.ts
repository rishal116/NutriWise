import { Request, Response, NextFunction } from "express";
import { IConversationController } from "../../interfaces/chat/IConversationController";
import { IConversationService } from "../../../services/interfaces/chat/IConversationService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class ConversationController implements IConversationController {
  constructor(
    @inject(TYPES.IConversationService)
    private _conversationService: IConversationService
  ) {}
  
  createDirectConversation = asyncHandler(async (req: Request, res: Response ) => {
    
    const conversation = await this._conversationService.createDirectConversation({
      currentUserId: req.user?.userId as string,
      otherUserId: req.body.otherUserId,
    });
    res.status(StatusCode.OK).json(conversation);
  });
  
  getUserChats = asyncHandler(async (req: Request, res: Response ) => {
    const conversations = await this._conversationService.getUserConversations(
      req.user?.userId as string
    );
    res.json(conversations);
  });
  
}
