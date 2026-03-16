export interface SendFileDTO {
  conversationId: string;
  senderId: string;
  file?: Express.Multer.File;
}