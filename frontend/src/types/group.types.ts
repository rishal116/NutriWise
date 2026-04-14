export interface Group {
  id: string;
  title: string;
  description?: string;
  memberCount: number;
  visibility: "public" | "private";
  joinStatus?: "none" | "requested" | "joined";
  isJoined: boolean;
  createdAt: string;
}

export interface GetGroupsResponse {
  groups: Group[];
  total: number;
}