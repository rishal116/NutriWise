import type { ClientSession } from "mongoose";

import type { IBaseRepository } from "./IBaseRepository";
import type { IWallet } from "../../../models/wallet.model";
import type { WalletOwnerType } from "../../../constants/common/wallet.constants";

export interface IWalletRepository extends IBaseRepository<IWallet> {
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
