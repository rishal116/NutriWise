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
  ACCESS_TOKEN_MISSING: "Access token missing",
  TOKEN_EXPIRED: "Access token expired",
  INVALID_TOKEN: "Invalid access token",
  INVALID_ROLE: "Invalid active role",
  USER_NOT_FOUND: "User not found",
  USER_BLOCKED: "User is blocked",

  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",

  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
} as const;



export const PAYMENT_MESSAGES = {
  CHECKOUT_CREATED: "Checkout session created",
  PAYMENT_VERIFIED: "Payment verified",
  PAYMENT_FAILED: "Payment failed",
  WEBHOOK_RECEIVED: "Webhook received",
} as const;
