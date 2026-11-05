import type { GetMeResponseDto } from "../../../dtos/user/auth/get-me-response.dto";

export interface IUserContextService {
  getMe(userId: string): Promise<GetMeResponseDto>;
}