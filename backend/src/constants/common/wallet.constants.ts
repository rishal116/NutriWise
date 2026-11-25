export const WALLET_OWNER_TYPES = ["admin", "nutritionist", "user"] as const;

export type WalletOwnerType = (typeof WALLET_OWNER_TYPES)[number];
