import { Request, Response } from "express";

import { injectable, inject } from "inversify";

import { IConversationController } from "../../interfaces/chat/IConversationController";

import { IConversationService } from "../../../services/interfaces/chat/IConversationService";

import { asyncHandler } from "../../../utils/asyncHandler";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { ConversationListFilter } from "../../../types/chat/conversation-list.types";

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

  getUserConversations = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._conversationService.getUserConversations(
      req.user?.userId as string,
      Number(req.query.limit),
      req.query.cursor as string | undefined,
      req.query.filter as ConversationListFilter | undefined,
      req.query.search as string | undefined,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

  getUserConversationDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this._conversationService.getUserConversationDetails(
        req.user?.userId as string,
        req.params.conversationId,
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: result,
      });
    },
  );
}
