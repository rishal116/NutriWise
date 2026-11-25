import { Schema, model, Types } from "mongoose";

import {
  CURRENCY,
  type Currency,
} from "../constants/common/currency.constants";
import {
  WALLET_OWNER_TYPES,
  type WalletOwnerType,
} from "../constants/common/wallet.constants";

export interface IWallet {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  ownerType: WalletOwnerType;
  availableBalance: number;
  escrowBalance: number;
  currency: Currency;
  isActive: boolean;
  lastTransactionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    ownerType: {
      type: String,
      enum: WALLET_OWNER_TYPES,
      required: true,
    },

    availableBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    escrowBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      enum: [CURRENCY],
      required: true,
      default: CURRENCY,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastTransactionAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

WalletSchema.index({ ownerType: 1, isActive: 1 });

export const WalletModel = model<IWallet>("Wallet", WalletSchema);
