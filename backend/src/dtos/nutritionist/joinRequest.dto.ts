export interface JoinRequestDto {
  userId: string;
  name: string;
  profileImage?: string | null;
  requestedAt: string;
}