import { UserRole } from "../../enums/user.enum";

export interface SendFileDTO {
  conversationId: string;
  senderId: string;
  context: UserRole;
  file?: Express.Multer.File;
 
}