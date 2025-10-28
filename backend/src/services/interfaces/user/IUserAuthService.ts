import { UserRegisterDto,VerifyOtpDto, UserRoleDto} from "../../../dtos/user/UserAuth.dtos";

export interface IUserAuthService {
  signup(data: UserRegisterDto): Promise<{ message: string }>;
  verifyOtp(data: VerifyOtpDto): Promise<{ message: string }>;
  selectUserRole(data: UserRoleDto): Promise<{ message: string; 
    accessToken: string; refreshToken: string; 
  }>;
  
}
