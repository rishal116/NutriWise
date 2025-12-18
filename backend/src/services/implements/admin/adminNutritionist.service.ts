import { injectable, inject } from "inversify";
import { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import { TYPES } from "../../../types/types";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import { INotificationRepository } from "../../../repositories/interfaces/INotificationRepository";
import { NotificationDto } from "../../../dtos/common/notification.dto";
import { AdminNutritionistProfileDTO, NutritionistStatusDTO } from "../../../dtos/admin/user.dto";
import { NutritionistListDTO } from "../../../dtos/admin/nutritionistList.dto";




@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminNutritionistRepository)
    private _adminNutritionistRepository: IAdminNutritionistRepository,
    @inject(TYPES.INutritionistProfileRepository) 
    private _nutritionistProfileRepository : INutritionistProfileRepository,
    @inject(TYPES.INotificationRepository) 
    private _notificationRepository : INotificationRepository,
  ) {}
  
  async getAllNutritionists( page: number, limit: number, search?: string): Promise<PaginatedResponseDto<NutritionistListDTO>> {
    const skip = (page - 1) * limit;
    const { nutritionists, total } = await this._adminNutritionistRepository.getAllNutritionists(skip, limit, search);
    const nutritionistDTOs = nutritionists.map(n => new NutritionistStatusDTO(n));
    return new PaginatedResponseDto<NutritionistStatusDTO>(nutritionistDTOs, total, page, limit);
  }

  async blockUser(userId: string): Promise<void> {
    return this._adminNutritionistRepository.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return this._adminNutritionistRepository.unblockUser(userId);
  }
  
  async getNutritionistById(userId: string) {
    const nutritionist = await this._nutritionistProfileRepository.findByUserId(userId)
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
    const user = await this._adminNutritionistRepository.updateById(userId, { 
      nutritionistStatus: "rejected",
      rejectionReason: reason
    });
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

   async getNutritionistProfile(userId: string): Promise<AdminNutritionistProfileDTO>{
    const user = await this._adminNutritionistRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const details = await this._nutritionistProfileRepository.findByUserId(userId);
    if (!details) throw new Error("Nutritionist details not found");
    return new AdminNutritionistProfileDTO(user, details);
  }

}
