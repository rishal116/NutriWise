import { Request, Response } from "express";
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
    private _conversationService: IConversationService,
  ) {}

  createDirectConversation = asyncHandler(
    async (req: Request, res: Response) => {
      console.log(req.body);

      const conversation =
        await this._conversationService.createDirectConversation({
          currentUserId: req.user?.userId as string,
          otherUserId: req.body.otherUserId,
          context: req.body.context,
        });
      res.status(StatusCode.OK).json({ success: true, data: conversation });
    },
  );

  getUserChats = asyncHandler(async (req: Request, res: Response) => {
    const { context } = req.query as {
      context: "user" | "nutritionist";
    };

    const cursor = req.query.cursor as string | undefined;

    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await this._conversationService.getUserConversations(
      req.user?.userId as string,
      context,
      cursor,
      limit,
    );

    res.status(StatusCode.OK).json({
      success: true,
      ...result,
    });
  });
}
