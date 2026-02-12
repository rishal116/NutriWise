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
    private _messageService: IMessageService
  ) {}
  
  sendMessage = asyncHandler(async (req: Request, res: Response ) => {
    const { conversationId, text, fileUrl, messageType } = req.body;
    if (!conversationId) {
        return res.status(StatusCode.BAD_REQUEST).json({
            message: "conversationId is required"
        });
    }
    const message = await this._messageService.sendMessage({
        conversationId,
        senderId: req.user?.userId as string,
        text,
        fileUrl,
        messageType,
    });
    res.status(StatusCode.CREATED).json(message);
    });


  getMessages = asyncHandler(async (req: Request, res: Response ) => {  
    const messages = await this._messageService.getMessages(
      req.params.conversationId,
    );
    console.log(messages);
    
    res.json(messages);
  });
  
}
