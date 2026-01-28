import { Schema, model, Types } from "mongoose";

export type WalletOwnerType = "ADMIN" | "NUTRITIONIST" | "USER";

export interface IWallet {
  ownerId: Types.ObjectId;        
  ownerType: WalletOwnerType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    ownerType: {
      type: String,
      enum: ["ADMIN", "NUTRITIONIST", "USER"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0, 
    },
    currency: {
      type: String,
      default: "INR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

walletSchema.index(
  { ownerId: 1, ownerType: 1 },
  { unique: true }
);

export const WalletModel = model<IWallet>("Wallet", walletSchema);
