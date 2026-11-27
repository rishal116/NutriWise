import type { ForgotPasswordDto } from "../../../../dtos/user/auth/forgot-password.dto";
import type { ResetPasswordDto } from "../../../../dtos/user/auth/reset-password.dto";

export interface IPasswordResetService {
  requestPasswordReset(data: ForgotPasswordDto): Promise<void>;

  resetPassword(data: ResetPasswordDto): Promise<void>;
}
