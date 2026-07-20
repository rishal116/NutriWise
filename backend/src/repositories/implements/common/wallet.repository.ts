import { injectable } from "inversify";
import { ClientSession, Types } from "mongoose";
import {
  IWallet,
  WalletModel,
  WalletOwnerType,
} from "../../../models/wallet.model";
import { BaseRepository } from "../common/base.repository";
import { IWalletRepository } from "../../interfaces/common/IWalletRepository";

@injectable()
export class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel);
  }

  async findByOwner(
    ownerId: string,
    ownerType: WalletOwnerType,
  ): Promise<IWallet | null> {
    return this._model.findOne({
      ownerId: new Types.ObjectId(ownerId),
      ownerType,
    });
  }

  async findOrCreate(
    ownerId: string,
    ownerType: WalletOwnerType,
    session?: ClientSession,
  ): Promise<IWallet> {
    const wallet = await this._model.findOneAndUpdate(
      {
        ownerId: new Types.ObjectId(ownerId),
        ownerType,
      },
      {
        $setOnInsert: {
          ownerId: new Types.ObjectId(ownerId),
          ownerType,
          availableBalance: 0,
          escrowBalance: 0,
          currency: "INR",
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        session,
      },
    );

    return wallet;
  }

  async credit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          availableBalance: amount,
        },
        $set: {
          lastTransactionAt: new Date(),
        },
      },
      { session },
    );
  }

  async debit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          availableBalance: -amount,
        },
        $set: {
          lastTransactionAt: new Date(),
        },
      },
      { session },
    );
  }

  async creditEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          escrowBalance: amount,
        },
        $set: {
          lastTransactionAt: new Date(),
        },
      },
      { session },
    );
  }

  async debitEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          escrowBalance: -amount,
        },
        $set: {
          lastTransactionAt: new Date(),
        },
      },
      { session },
    );
  }

  async moveEscrowToBalance(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          escrowBalance: -amount,
          availableBalance: amount,
        },
        $set: {
          lastTransactionAt: new Date(),
        },
      },
      { session },
    );
  }

  async releaseEscrowToWallet(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.debitEscrow(fromWalletId, amount, session);
    await this.credit(toWalletId, amount, session);
  }
}
