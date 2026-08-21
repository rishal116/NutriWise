import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { IConversationController } from "../../interfaces/chat/IConversationController";
import { IConversationService } from "../../../services/interfaces/chat/IConversationService";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class ConversationController implements IConversationController {
  constructor(
    @inject(TYPES.IConversationService)
    private readonly _conversationService: IConversationService,
  ) {}

  createDirectConversation = asyncHandler(
    async (req: Request, res: Response) => {
      const conversation =
        await this._conversationService.createDirectConversation({
          currentUserId: req.user?.userId as string,
          otherUserId: req.body.otherUserId,
        });

      res.status(StatusCode.OK).json({
        success: true,
        data: conversation,
      });
    },
  );

  getUserChats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const limit = Math.min(Number(req.query.limit) || 20, 50);

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = await this._conversationService.getUserConversations(
      userId,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });
}
