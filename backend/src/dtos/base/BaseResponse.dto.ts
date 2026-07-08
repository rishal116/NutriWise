import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class BaseResponseDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  error?: string;

  constructor(success: boolean, message?: string, error?: string) {
    this.success = success;
    this.message = message;
    this.error = error;
  }
}

