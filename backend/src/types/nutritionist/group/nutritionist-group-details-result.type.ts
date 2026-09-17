export interface NutritionistGroupDetailsResult {
  id: string;
  title: string;
  description?: string;
  groupAvatar?: string;
  visibility: "public" | "private";
  status: "active" | "inactive" | "blocked" | "closed";
  memberCount: number;
  inviteTokenEncrypted?: string;
  createdAt: Date;
  updatedAt: Date;
}