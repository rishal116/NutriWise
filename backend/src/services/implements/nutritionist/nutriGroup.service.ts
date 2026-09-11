import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { INutriGroupService } from "../../interfaces/nutritionist/INutriGroupService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { IConversation } from "../../../models/conversation.model";
import { Types } from "mongoose";

@injectable()
export class NutriGroupService implements INutriGroupService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private _conversationRepo: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private _conversationMemberRepo: IConversationMemberRepository,
  ) {}

  async createGroup(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<IConversation> {
    logger.info("Creating group started", {
      userId,
      title: data.title,
    });

    if (!data.title || data.title.trim().length < 3) {
      throw new CustomError(
        "Group title must be at least 3 characters",
        StatusCode.BAD_REQUEST,
      );
    }

    const group = await this._conversationRepo.create({
      chatType: "group",
      purpose: "group_coaching",
      title: data.title,
      description: data.description,
    });

    logger.info("Group created", {
      groupId: group._id,
    });

    await this._conversationMemberRepo.create({
      conversationId: group._id,
      userId: new Types.ObjectId(userId),
      role: "owner",
    });

    logger.info("Creator added as owner", {
      userId,
      groupId: group._id,
    });

    return group;
  }

  async getMyGroups(
    userId: string,
    limit = 10,
    skip = 0,
  ): Promise<IConversation[]> {
    const memberships = await this._conversationMemberRepo.findByUser(userId);

    const groupIds = new Set(memberships.map((m) => m.conversationId.toString()));

    const groups = await this._conversationRepo.findGroups(limit, skip);

    return groups.filter((g) => groupIds.has(g._id.toString()));
  }
}
