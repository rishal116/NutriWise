const ADMIN_BASE = "/api/admin";

export const ADMIN_PAYMENT_ROUTES = {
  LIST: `${ADMIN_BASE}/payments`,
  COUNT: `${ADMIN_BASE}/payments/count`,
  STATISTICS: `${ADMIN_BASE}/payments/statistics`,
  DETAILS: (paymentId: string) => `${ADMIN_BASE}/payments/${paymentId}`,

  WALLETS: `${ADMIN_BASE}/payments/wallets`,
  WALLET_DETAILS: (walletId: string) =>
    `${ADMIN_BASE}/payments/wallets/${walletId}`,
  WALLET_TRANSACTIONS: (walletId: string) =>
    `${ADMIN_BASE}/payments/wallets/${walletId}/transactions`,
} as const;