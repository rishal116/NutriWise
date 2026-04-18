import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IJoinRequestRepository } from "../../interfaces/chat/IJoinRequestRepository";
import {
  IJoinRequest,
  JoinRequestModel,
  JoinRequestStatus,
} from "../../../models/joinRequest.model";

export class JoinRequestRepository
  extends BaseRepository<IJoinRequest>
  implements IJoinRequestRepository
{
  constructor() {
    super(JoinRequestModel);
  }

  async createRequest(
    conversationId: string,
    userId: string,
  ): Promise<IJoinRequest> {
    return this._model.create({
      conversationId: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
      status: "pending",
    });
  }

  async findPendingByConversation(
    conversationId: string,
  ): Promise<IJoinRequest[]> {
    return this._model
      .find({
        conversationId: new Types.ObjectId(conversationId),
        status: "pending",
      })
      .lean<IJoinRequest[]>()
      .exec();
  }

  async findPendingByUser(
    userId: string,
    groupIds: string[],
  ): Promise<IJoinRequest[]> {
    return this._model
      .find({
        userId: new Types.ObjectId(userId),
        conversationId: {
          $in: groupIds.map((id) => new Types.ObjectId(id)),
        },
        status: "pending",
      })
      .lean<IJoinRequest[]>()
      .exec();
  }

  async findUserRequest(
    conversationId: string,
    userId: string,
  ): Promise<IJoinRequest | null> {
    return this._model
      .findOne({
        conversationId: new Types.ObjectId(conversationId),
        userId: new Types.ObjectId(userId),
      })
      .lean<IJoinRequest | null>()
      .exec();
  }

  async updateStatus(
    conversationId: string,
    userId: string,
    status: JoinRequestStatus,
  ): Promise<void> {
    await this._model.updateOne(
      {
        conversationId: new Types.ObjectId(conversationId),
        userId: new Types.ObjectId(userId),
      },
      {
        $set: { status },
      },
    );
  }

  async deleteRequest(conversationId: string, userId: string): Promise<void> {
    await this._model.deleteOne({
      conversationId: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
    });
  }

  async exists(conversationId: string, userId: string): Promise<boolean> {
    const count = await this._model.countDocuments({
      conversationId: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
    });

    return count > 0;
  }
}
