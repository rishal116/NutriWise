export const TYPES = {
  //User
  IUserAuthController: Symbol.for("IUserAuthController"),
  IUserAuthService: Symbol.for("IUserAuthService"),
  IUserRepository: Symbol.for("IUserRepository"),
  IOTPService: Symbol.for("IOTPService"),
  IOtpRepository: Symbol.for("IOtpRepository"),
  INutritionistController: Symbol.for("INutritionistController"),
  INutritionistService: Symbol.for("INutritionistService"),
  IUserProfileController: Symbol.for("IUserProfileController"),
  IUserProfileService: Symbol.for("IUserProfileService"),


  //Admin
  IAdminAuthController: Symbol.for("IAdminAuthController"),
  IAdminAuthService: Symbol.for("IAdminAuthService"),
  IAdminAuthRepository: Symbol.for("IAdminRepository"),

  IAdminNutritionistController : Symbol.for("IAdminNutritionistController"),
  IAdminNutritionistService : Symbol.for("IAdminNutritionistService"),
  IAdminNutritionistRepository : Symbol.for("IAdminNutritionistRepository"),

  IAdminClientController : Symbol.for("IAdminClientController"),
  IAdminClientService : Symbol.for("IAdminClientService"),
  IAdminClientRepository : Symbol.for("IAdminClientRepository"),

  
  
  IAdminNotificationController:Symbol.for("IAdminNotificationController"),
  INotificationRepository:Symbol.for("INotificationRepository"),
  INotificationService:Symbol.for("INotificationService"),




  
  //Nutritionist
  INutritionistAuthController: Symbol.for("INutritionistAuthController"),
  INutritionistAuthService: Symbol.for("INutritionistAuthService"),
  INutritionistDetailsRepository: Symbol.for("INutritionistDetailsRepository"),

  INutritionistProfileController : Symbol.for("INutritionistProfileController"),
  INutritionistProfileService : Symbol.for("INutritionistProfileService"),
  INutritionistProfileRepository : Symbol.for("INutritionistProfileRepository"),
  
  INutritionistAvailabilityController: Symbol.for("INutritionistAvailabilityController"),
  INutritionistAvailabilityService: Symbol.for("INutritionistAvailabilityService"),
  INutritionistAvailabilityRepository: Symbol.for("INutritionistAvailabilityRepository"),
  
};
