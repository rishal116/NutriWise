import { IWallet } from "../../../models/wallet.model";

export interface IWalletRepository {
    
  findByOwner(
    ownerId: string,
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN"
  ): Promise<IWallet | null>;

  findOrCreate(
    ownerId: string,
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN"
  ): Promise<IWallet>;

  credit(walletId: string, amount: number): Promise<void>;
  debit(walletId: string, amount: number): Promise<void>;
}
