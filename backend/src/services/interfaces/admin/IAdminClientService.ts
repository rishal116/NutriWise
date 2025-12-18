import { UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";

export interface IAdminClientService {
  getAllUsers(page: number, limit: number, search?:string): Promise<PaginatedResponseDto<UserDTO>>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}