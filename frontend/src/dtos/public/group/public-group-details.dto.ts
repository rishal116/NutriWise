export interface PublicGroupDetailsDTO {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public";
  status: "active";
  memberCount: number;
  isMember: boolean;
  createdAt: string;
  updatedAt: string;
}