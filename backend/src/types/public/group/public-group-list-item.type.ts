export interface PublicGroupListItem {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public";
  status: "active";
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}