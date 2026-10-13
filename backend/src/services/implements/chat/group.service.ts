import { createHash } from "crypto";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IGroupService } from "../../interfaces/chat/IGroupService";
import { IConversationRepository } from "../../../repositories/interfaces/chat/IConversationRepository";
import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { MAX_GROUP_MEMBERS } from "../../../constants/chat/chat.constant";

@injectable()
export class GroupService implements IGroupService {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _conversationMemberRepository: IConversationMemberRepository,
  ) {}

  async joinPrivateGroup(
    userId: string,
    inviteToken: string,
  ): Promise<{ groupId: string; joined: boolean }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID.", StatusCode.BAD_REQUEST);
    }

    if (!inviteToken?.trim()) {
      throw new CustomError(
        "Invitation token is required.",
        StatusCode.BAD_REQUEST,
      );
    }

    const inviteTokenHash = createHash("sha256")
      .update(inviteToken.trim())
      .digest("hex");

    const group =
      await this._conversationRepository.findPrivateGroupByInviteTokenHash(
        inviteTokenHash,
      );

    if (!group) {
      throw new CustomError(
        "Invalid or expired invitation link.",
        StatusCode.NOT_FOUND,
      );
    }

    const groupId = group._id.toString();

    // Return early for existing active members, even if the group is full.
    const existingMember = await this._conversationMemberRepository.findMember(
      groupId,
      userId,
    );

    if (existingMember) {
      return { groupId, joined: false };
    }

    const memberCount =
      await this._conversationMemberRepository.countActiveMembers(groupId);

    if (memberCount >= MAX_GROUP_MEMBERS) {
      throw new CustomError(
        "This group has reached its maximum member capacity.",
        StatusCode.CONFLICT,
      );
    }

    const result = await this._conversationMemberRepository.joinGroup(
      groupId,
      userId,
    );

    if (result === "blocked") {
      throw new CustomError(
        "You cannot join this group.",
        StatusCode.FORBIDDEN,
      );
    }

    if (result === "conflict") {
      throw new CustomError(
        "Unable to join this group. Please try again.",
        StatusCode.CONFLICT,
      );
    }

    if (result === "joined") {
      logger.info("User joined private group", {
        userId,
        groupId,
      });
    }

    return {
      groupId,
      joined: result === "joined",
    };
  }
}
