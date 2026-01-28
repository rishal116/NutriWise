export const COMMON_MESSAGES = {
  SUCCESS: "Success",
  CREATED: "Created",
  UPDATED: "Updated",
  DELETED: "Deleted",
  NOT_FOUND: "Resource not found",
  VALIDATION_FAILED: "Validation failed",
  SOMETHING_WENT_WRONG: "Something went wrong",
} as const;

export const AUTH_MESSAGES = {
  AUTH_HEADER_MISSING: "Authorization header missing",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  TOKEN_EXPIRED: "Token expired",
  INVALID_TOKEN: "Invalid token",
  AUTH_FAILED: "Authentication failed",
  INVALID_ROLE: "Invalid role in token",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
} as const;

export const PAYMENT_MESSAGES = {
  CHECKOUT_CREATED: "Checkout session created",
  PAYMENT_VERIFIED: "Payment verified",
  PAYMENT_FAILED: "Payment failed",
  WEBHOOK_RECEIVED: "Webhook received",
} as const;
