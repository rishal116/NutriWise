import type {
  ConversationStatus,
  ConversationVisibility,
} from "../../../models/conversation.model";

export class GroupCardDTO {
  id!: string;
  title!: string;
  description?: string;
  groupAvatar?: string;
  visibility!: ConversationVisibility;
  status!: ConversationStatus;
  memberCount!: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<GroupCardDTO>) {
    Object.assign(this, data);
  }
}