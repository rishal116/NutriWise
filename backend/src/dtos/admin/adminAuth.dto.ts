// Request DTOs (input)
export interface AdminLoginDto {
  email: string;
  password: string;
}
export interface AdminForgotPasswordDto {
  email: string;
}

//Response DTO (input)
interface AdminAuthEntity {
  _id: string;
  email: string;
  role: string;
}
export class AdminLoginResponseDto {
  admin: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  
  constructor(admin: AdminAuthEntity,accessToken: string,refreshToken: string) {
    this.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

