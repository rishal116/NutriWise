import { injectable, inject } from "inversify";
import { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import { TYPES } from "../../../types/types";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import { NutritionistDTO } from "../../../dtos/admin/user.dto";
import { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import { INotificationRepository } from "../../../repositories/interfaces/INotificationRepository";
import { NotificationDto } from "../../../dtos/common/notification.dto";
import { NutritionistProfileDto } from "../../../dtos/nutritionist/nutritionistProfile";




@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminNutritionistRepository)
    private _adminNutritionistRepository: IAdminNutritionistRepository,
    @inject(TYPES.INutritionistDetailsRepository) 
    private _nutritionistDetailsRepository : INutritionistDetailsRepository,
    @inject(TYPES.INotificationRepository) 
    private _notificationRepository : INotificationRepository,
  ) {}
  

  async getAllNutritionists(page: number, limit: number, search?: string): Promise<PaginatedResponseDto<NutritionistDTO>> {
    const skip = (page - 1) * limit;
    const { nutritionists, total } = await this._adminNutritionistRepository.getAllNutritionists(skip, limit, search);
    const nutritionistDTOs: NutritionistDTO[] = nutritionists.map(n => ({
      id: n._id as string,
      name: n.fullName || "",
      email: n.email || "",
      role: n.role!,
      isBlocked: n.isBlocked ?? false,
      nutritionistStatus: n.nutritionistStatus || "none",
    }));
    return new PaginatedResponseDto<NutritionistDTO>(nutritionistDTOs, total, page, limit);
  }

  async blockUser(userId: string): Promise<void> {
    return this._adminNutritionistRepository.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return this._adminNutritionistRepository.unblockUser(userId);
  }
  
  async getNutritionistById(userId: string) {
    const nutritionist = await this._nutritionistDetailsRepository.findByUserId(userId)
    return nutritionist;
  }

  async approveNutritionist(userId: string): Promise<void> {
    const user = await this._adminNutritionistRepository.updateById(userId, { nutritionistStatus: "approved" });
    if (!user) throw new Error("User not found");
    const notification: NotificationDto = {
      title: "Your profile has been approved",
      message: "Congratulations! Your nutritionist profile is now approved.",
      type: "success",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    };
    await this._notificationRepository.createNotification(notification);
  }
  
  
  async rejectNutritionist(userId: string, reason: string): Promise<void> {
    const user = await this._adminNutritionistRepository.updateById(userId, { nutritionistStatus: "rejected" });
    if (!user) throw new Error("User not found");
    const notification: NotificationDto = {
      title: "Your profile has been rejected",
      message: `Your nutritionist profile was rejected. Reason: ${reason}`,
      type: "error",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    };
    await this._notificationRepository.createNotification(notification);
  }

   async getNutritionistProfile(userId: string): Promise<NutritionistProfileDto> {
    const user = await this._adminNutritionistRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const details = await this._nutritionistDetailsRepository.findByUserId(userId);
    if (!details) throw new Error("Nutritionist details not found");
    return {
      _id: user._id!.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: details.profileImage || user.profileImage,
      nutritionistStatus: user.nutritionistStatus || "none",
      rejectionReason: user.rejectionReason || "",
      qualifications: details.qualifications,
      specializations: details.specializations,
      bio: details.bio,
      languages: details.languages,
      videoCallRate: details.videoCallRate,
      consultationDuration: details.consultationDuration,
      location: details.location,
      experiences: details.experiences,
      totalExperienceYears: details.totalExperienceYears || 0,
      cv: details.cv,
      certifications: details.certifications || [],
      availabilityStatus: details.availabilityStatus,
      createdAt: details.createdAt,
      updatedAt: details.updatedAt,
    };
  }

}
