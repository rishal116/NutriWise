export const USER_MESSAGES = {
  // AUTH
  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP expired",
  PASSWORD_CHANGED: "Password changed successfully",

  // USER PROFILE
  PROFILE_UPDATED: "Profile updated successfully",

  // CLIENT PROFILE / HEALTH
  CLIENT_PROFILE_CREATED: "Client profile created successfully",
  CLIENT_PROFILE_UPDATED: "Client profile updated successfully",
  CLIENT_PROFILE_COMPLETION_UPDATED:
    "Client profile completion updated successfully",
  CLIENT_PROFILE_DELETED: "Client profile deleted successfully",

  // LEGACY / OPTIONAL
  HEALTH_DETAILS_UPDATED: "Health details updated successfully",

  // PLANS
  PLANS_FETCHED: "Plans fetched successfully",
} as const;