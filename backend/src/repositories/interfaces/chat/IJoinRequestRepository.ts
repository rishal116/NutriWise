import { IBaseRepository } from "../common/IBaseRepository";
import {
  IJoinRequest,
  JoinRequestStatus,
} from "../../../models/joinRequest.model";

export interface IJoinRequestRepository extends IBaseRepository<IJoinRequest> {
  createRequest(conversationId: string, userId: string): Promise<IJoinRequest>;

  findPendingByConversation(conversationId: string): Promise<IJoinRequest[]>;
  findPendingByUser(
    userId: string,
    groupIds: string[],
  ): Promise<IJoinRequest[]>;

  findUserRequest(
    conversationId: string,
    userId: string,
  ): Promise<IJoinRequest | null>;

  updateStatus(
    conversationId: string,
    userId: string,
    status: JoinRequestStatus,
  ): Promise<void>;

  deleteRequest(conversationId: string, userId: string): Promise<void>;

  exists(conversationId: string, userId: string): Promise<boolean>;
}
