const USER_BASE = "/api/users";
const PAYMENT_BASE = `${USER_BASE}/payments`;

export const USER_PAYMENT_ROUTES = {
  PAYMENTS: PAYMENT_BASE,
  PAYMENT_BY_ID: (paymentId: string) =>
    `${PAYMENT_BASE}/${paymentId}`,
  WALLET: `${PAYMENT_BASE}/wallet`,
  WALLET_TRANSACTIONS: `${PAYMENT_BASE}/wallet/transactions`,
} as const;