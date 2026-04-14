import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IWalletRepository } from "../../interfaces/common/IWalletRepository";
import { WalletModel, IWallet } from "../../../models/wallet.model";
import { Types, ClientSession } from "mongoose";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(WalletModel);
  }
  
  async findByOwner(ownerId: string,ownerType: "USER" | "NUTRITIONIST" | "ADMIN"): Promise<IWallet | null> {
    return this._model.findOne({
      ownerId: new Types.ObjectId(ownerId),
      ownerType,
    });
  }
  
  async findOrCreate(ownerId: string,ownerType: "USER" | "NUTRITIONIST" | "ADMIN",session?:ClientSession
  ): Promise<IWallet> {
    const wallet = await this._model.findOneAndUpdate(
      { ownerId: new Types.ObjectId(ownerId), ownerType },
      { $setOnInsert: { balance: 0 } },
      { new: true, upsert: true,session  },
    );
    return wallet;
  }
  
  async credit(walletId: string, amount: number, session?: ClientSession): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { balance: amount } },
      { session }
    );
  }
  
  async debit(walletId: string, amount: number,session?: ClientSession): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { balance: -amount } },
      { session }
    );
  }
  
  async creditEscrow(walletId: string, amount: number, session?: ClientSession) {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { escrowBalance: amount } },
      { session }
    );
  }
  
  async debitEscrow(walletId: string, amount: number, session?: ClientSession) {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { escrowBalance: -amount } },
      { session }
    );
  }
  
  async moveEscrowToBalance(walletId: string,amount: number,session?: ClientSession) {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      {
        $inc: {
          escrowBalance: -amount,
          balance: amount,
        },
      },
      { session }
    );
  }
  
  async releaseEscrowToWallet(fromWalletId: string,toWalletId: string,amount: number,session?: ClientSession) {
    await this._model.updateOne(
      { _id: new Types.ObjectId(fromWalletId) },
      { $inc: { escrowBalance: -amount } },
      { session }
    );
    
    await this._model.updateOne(
      { _id: new Types.ObjectId(toWalletId) },
      { $inc: { balance: amount } },
      { session }
    );
  }
  
}

