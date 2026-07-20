import { ClientSession } from "mongoose";
import { IWallet, WalletOwnerType } from "../../../models/wallet.model";

export interface IWalletRepository {
  findByOwner(
    ownerId: string,
    ownerType: WalletOwnerType,
  ): Promise<IWallet | null>;

  findOrCreate(
    ownerId: string,
    ownerType: WalletOwnerType,
    session?: ClientSession,
  ): Promise<IWallet>;

  credit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;

  debit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;

  creditEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;

  debitEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;

  moveEscrowToBalance(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;

  releaseEscrowToWallet(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void>;
}
