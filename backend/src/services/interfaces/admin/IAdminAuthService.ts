import { AdminLoginDto, AdminLoginResponseDto } from "../../../dtos/admin/adminAuth.dto";

export interface IAdminAuthService {
  login(dto: AdminLoginDto): Promise<AdminLoginResponseDto>;
}
