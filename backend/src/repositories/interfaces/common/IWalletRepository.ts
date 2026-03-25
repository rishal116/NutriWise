import { IWallet } from "../../../models/wallet.model";
import { ClientSession } from "mongoose";

export interface IWalletRepository {
    
  findByOwner(
    ownerId: string,
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN",
  ): Promise<IWallet | null>;

  findOrCreate(
    ownerId: string,
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN",
     session?: ClientSession
  ): Promise<IWallet>;

  credit(walletId: string, amount: number, session?: ClientSession): Promise<void>;
  debit(walletId: string, amount: number, session?: ClientSession): Promise<void>;
  creditEscrow(
  walletId: string,
  amount: number,
  session?: ClientSession
): Promise<void>;

debitEscrow(
  walletId: string,
  amount: number,
  session?: ClientSession
): Promise<void>;

releaseEscrowToWallet(
  fromWalletId: string,
  toWalletId: string,
  amount: number,
  session?: ClientSession
): Promise<void>;

moveEscrowToBalance(
  walletId: string,
  amount: number,
  session?: ClientSession
): Promise<void>;
}
