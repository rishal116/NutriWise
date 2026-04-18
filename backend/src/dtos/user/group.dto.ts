export type JoinStatus = "none" | "joined" | "requested";

export interface GroupDto {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  memberCount: number;
  isJoined: boolean;
  joinStatus: JoinStatus; 
  createdAt: Date;
}