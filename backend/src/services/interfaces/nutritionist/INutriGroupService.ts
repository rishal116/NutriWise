import { IConversation } from "../../../models/conversation.model";

export interface INutriGroupService {
  createGroup(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<IConversation>;

  getMyGroups(userId: string,role:string,limit:number,skip:number): Promise<IConversation[]>;
}
