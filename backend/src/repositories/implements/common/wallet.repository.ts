import { injectable } from "inversify";
import {
  type ClientSession,
  type FilterQuery,
  type UpdateQuery,
  Types,
} from "mongoose";

import { CURRENCY } from "../../../constants/common/currency.constants";
import type { WalletOwnerType } from "../../../constants/common/wallet.constants";
import { BaseRepository } from "../common/base.repository";
import { WalletModel, type IWallet } from "../../../models/wallet.model";
import type { IWalletRepository } from "../../interfaces/common/IWalletRepository";

type WalletBalanceField = "availableBalance" | "escrowBalance";

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
    return this.findOne({
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
          currency: CURRENCY,
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        session,
      },
    );

    if (!wallet) {
      throw new Error("Wallet upsert operation failed.");
    }

    return wallet;
  }

  async credit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.updateBalance(walletId, { availableBalance: amount }, session);
  }

  async debit(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.updateBalance(
      walletId,
      { availableBalance: -amount },
      session,
      "availableBalance",
      amount,
    );
  }

  async creditEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.updateBalance(walletId, { escrowBalance: amount }, session);
  }

  async debitEscrow(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.updateBalance(
      walletId,
      { escrowBalance: -amount },
      session,
      "escrowBalance",
      amount,
    );
  }

  async moveEscrowToBalance(
    walletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this.updateBalance(
      walletId,
      {
        escrowBalance: -amount,
        availableBalance: amount,
      },
      session,
      "escrowBalance",
      amount,
    );
  }

  async releaseEscrowToWallet(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    if (!session) {
      throw new Error("A transaction session is required.");
    }

    await this.debitEscrow(fromWalletId, amount, session);
    await this.credit(toWalletId, amount, session);
  }

  private async updateBalance(
    walletId: string,
    changes: Partial<Record<WalletBalanceField, number>>,
    session?: ClientSession,
    requiredBalanceField?: WalletBalanceField,
    requiredAmount?: number,
  ): Promise<void> {
    const filter: FilterQuery<IWallet> = {
      _id: new Types.ObjectId(walletId),
    };

    if (requiredBalanceField && requiredAmount !== undefined) {
      filter[requiredBalanceField] = { $gte: requiredAmount };
    }

    const update: UpdateQuery<IWallet> = {
      $inc: changes,
      $set: {
        lastTransactionAt: new Date(),
      },
    };

    const result = await this._model.updateOne(filter, update, { session });

    if (result.matchedCount === 0) {
      throw new Error("Wallet balance update failed.");
    }
  }
}
