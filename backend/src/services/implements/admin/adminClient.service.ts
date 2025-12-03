import { injectable, inject } from "inversify";
import { IAdminClientRepository } from "../../../repositories/interfaces/admin/IAdminClientRepository";
import { IAdminClientService } from "../../interfaces/admin/IAdminClientService";
import { TYPES } from "../../../types/types";
import { UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";



@injectable()
export class AdminClientService implements IAdminClientService {
  constructor(
    @inject(TYPES.IAdminClientRepository)
    private _adminClientRepository: IAdminClientRepository,
  ) {}
  
  async getAllUsers( page: number = 1, limit: number = 10, search?: string ): Promise<PaginatedResponseDto<UserDTO>> {
    const skip = (page - 1) * limit;
    const { users, total } = await this._adminClientRepository.getAllUsers(skip, limit, search);
    const userDTOs: UserDTO[] = users.map(u => ({
      id: u._id as string,
      name: u.fullName || "",
      email: u.email || "",
      role: u.role!,
      isBlocked: u.isBlocked ?? false,
    }));
    return new PaginatedResponseDto<UserDTO>(userDTOs, total, page, limit);
  }
  
  async blockUser(userId: string): Promise<void> {
    return this._adminClientRepository.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return this._adminClientRepository.unblockUser(userId);
  }

}
