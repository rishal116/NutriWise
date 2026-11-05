import type { LoginDto } from "../../../../dtos/user/auth/login.dto";
import type { GoogleAuthDto } from "../../../../dtos/user/auth/google-auth.dto";
import type { AuthResponseDto } from "../../../../dtos/user/auth/auth-response.dto";

export interface ILoginService {
  login(data: LoginDto): Promise<AuthResponseDto>;

  googleAuth(data: GoogleAuthDto): Promise<AuthResponseDto>;
}
