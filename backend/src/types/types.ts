export const TYPES = {
  // 🧩 User
  IUserAuthController: Symbol.for("IUserAuthController"),
  IUserAuthService: Symbol.for("IUserAuthService"),
  IUserRepository: Symbol.for("IUserRepository"),
  IOTPService: Symbol.for("IOTPService"),
  IOtpRepository: Symbol.for("IOtpRepository"),
  INutritionistController: Symbol.for("INutritionistController"),
  INutritionistService: Symbol.for("INutritionistService"),
  IUserProfileController: Symbol.for("IUserProfileController"),
  IUserProfileService: Symbol.for("IUserProfileService"),


  // 🧑‍💼 Admin
  IAdminUsersController: Symbol.for("IAdminUsersController"),
  IAdminAuthController: Symbol.for("IAdminAuthController"),
  IAdminUsersService: Symbol.for("IAdminUsersService"),
  IAdminAuthService: Symbol.for("IAdminAuthService"),
  IAdminRepository: Symbol.for("IAdminRepository"),
  IAdminNotificationController:Symbol.for("IAdminNotificationController"),
  IAdminNotificationRepository:Symbol.for("IAdminNotificationRepository"),
  IAdminNotificationService:Symbol.for("IAdminNotificationService"),

  // 🍎 Nutritionist
  INutritionistAuthController: Symbol.for("INutritionistAuthController"),
  INutritionistAuthService: Symbol.for("INutritionistAuthService"),
  INutritionistDetailsRepository: Symbol.for("INutritionistDetailsRepository"),
};
