import type {
  ConversationStatus,
  ConversationVisibility,
} from "../../../models/conversation.model";

export class GroupDetailsDTO {
  id!: string;
  title!: string;
  description?: string;
  groupAvatar?: string;
  visibility!: ConversationVisibility;
  status!: ConversationStatus;
  memberCount!: number;
  inviteToken?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<GroupDetailsDTO>) {
    Object.assign(this, data);
  }
}