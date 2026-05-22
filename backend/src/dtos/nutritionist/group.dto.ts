export interface GroupPaginationCursorDto {
  lastMessageAt: string;
  id: string;
}

export interface GroupPaginationDto {
  hasMore: boolean;
  nextCursor: GroupPaginationCursorDto | null;
}

export interface GroupDto {
  id: string;
  title?: string;
  description?: string;
  visibility?: "public" | "private";
  memberCount: number;
  lastMessageAt?: Date;
}

export interface GroupListResponseDto {
  groups: GroupDto[];
  pagination: GroupPaginationDto;
}

export interface MemberDto {
  userId: string;
  name: string;
  profileImage?: string | null;
  role: "owner" | "member" | "admin";
}

export interface GroupDetailsDto {
  id: string;
  title?: string;
  description?: string;
  memberCount: number;
  members: MemberDto[];
  visibility: "public" | "private";
}