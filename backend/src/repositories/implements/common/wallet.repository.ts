import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IWalletRepository } from "../../interfaces/common/IWalletRepository";
import { WalletModel, IWallet } from "../../../models/wallet.model";
import { Types } from "mongoose";

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
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN"
  ): Promise<IWallet | null> {
    return this._model.findOne({
      ownerId: new Types.ObjectId(ownerId),
      ownerType,
    });
  }

  async findOrCreate(
    ownerId: string,
    ownerType: "USER" | "NUTRITIONIST" | "ADMIN"
  ): Promise<IWallet> {
    const wallet = await this._model.findOneAndUpdate(
      { ownerId: new Types.ObjectId(ownerId), ownerType },
      { $setOnInsert: { balance: 0 } },
      { new: true, upsert: true }
    );
    return wallet;
  }

  async credit(walletId: string, amount: number): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { balance: amount } }
    );
  }

  async debit(walletId: string, amount: number): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(walletId) },
      { $inc: { balance: -amount } }
    );
  }
}
