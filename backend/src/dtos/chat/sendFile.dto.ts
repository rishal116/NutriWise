import { RoleContext } from "../../models/conversationMember.model";

export interface SendFileDTO {
  conversationId: string;
  senderId: string;
   context: RoleContext;
  file?: Express.Multer.File;
 
}