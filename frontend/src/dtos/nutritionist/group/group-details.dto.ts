export interface GroupDetailsDTO {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public" | "private";
  status: "active" | "inactive" | "blocked" | "closed";
  memberCount: number;
  inviteToken?: string;
  createdAt: string;
  updatedAt: string;
}