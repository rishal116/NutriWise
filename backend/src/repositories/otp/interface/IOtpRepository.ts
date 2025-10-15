export interface IOtpRepository {
  upsertOtp(email: string, otp: string, expiresAt: Date): Promise<void>;
  findByEmail(email: string): Promise<{ otp: string; expiresAt: Date } | null>;
  deleteByEmail(email: string): Promise<void>;
}
