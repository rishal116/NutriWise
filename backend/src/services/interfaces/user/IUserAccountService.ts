export interface IUserAccountService {
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;
}
