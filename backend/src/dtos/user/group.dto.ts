export interface GroupDto {
  id: string;
  title: string;
  description?: string;
  visibility: "public" | "private";
  memberCount: number;
  isJoined: boolean;
  createdAt: Date;
}