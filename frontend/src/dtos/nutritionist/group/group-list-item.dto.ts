export interface GroupListItemDTO {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public" | "private";
  status: "active" | "inactive" | "blocked" | "closed";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}