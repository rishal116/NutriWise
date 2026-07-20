import { Schema, model, Types } from "mongoose";

export const WALLET_OWNER_TYPES = [
  "admin",
  "nutritionist",
  "user",
] as const;

export const WALLET_CURRENCIES = [
  "INR",
  "USD",
] as const;

export type WalletOwnerType =
  (typeof WALLET_OWNER_TYPES)[number];

export type WalletCurrency =
  (typeof WALLET_CURRENCIES)[number];

export interface IWallet {
  _id: Types.ObjectId;

  ownerId: Types.ObjectId;

  ownerType: WalletOwnerType;

  availableBalance: number;

  escrowBalance: number;

  currency: WalletCurrency;

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
      index: true,
    },

    ownerType: {
      type: String,
      enum: WALLET_OWNER_TYPES,
      required: true,
      index: true,
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
      enum: WALLET_CURRENCIES,
      default: "INR",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

WalletSchema.index(
  {
    ownerId: 1,
    ownerType: 1,
  },
  {
    unique: true,
  },
);

WalletSchema.index({
  ownerType: 1,
  isActive: 1,
});

export const WalletModel = model<IWallet>(
  "Wallet",
  WalletSchema,
);