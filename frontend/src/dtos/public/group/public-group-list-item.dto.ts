export interface PublicGroupListItemDTO {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public";
  status: "active";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}