import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminNutritionistService } from "../../interfaces/admin/IAdminNutritionistService";
import { IAdminClientRepository } from "../../../repositories/interfaces/admin/IAdminClientRepository";
import { IAdminNutritionistRepository } from "../../../repositories/interfaces/admin/IAdminNutritionistRepository";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import {AdminNutritionistProfileDTO,NutritionistStatusDTO} from "../../../dtos/admin/user.dto";
import { NutritionistListDTO } from "../../../dtos/admin/nutritionistList.dto";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";

@injectable()
export class AdminNutritionistService implements IAdminNutritionistService {
  constructor(
    @inject(TYPES.IAdminClientRepository)
    private _adminNutritionistRepository: IAdminClientRepository,

    @inject(TYPES.IAdminNutritionistRepository)
    private _nutritionistProfileRepository: IAdminNutritionistRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository
  ) {}

  async getAllNutritionists(page: number,limit: number,search?: string): 
  Promise<PaginatedResponseDto<NutritionistListDTO>> {
    const skip = (page - 1) * limit;
    logger.info(`Fetching nutritionists | page=${page}, limit=${limit}, search=${search ?? "none"}`);
    const { nutritionists, total } = 
    await this._adminNutritionistRepository.getAllNutritionists(skip, limit, search);
    const dtos = nutritionists.map((n) => new NutritionistStatusDTO(n));
    logger.info(`Fetched nutritionists successfully | total=${total}`);
    return new PaginatedResponseDto(dtos, total, page, limit);
  }
  
  async getNutritionistById(userId: string) {
    logger.info(`Fetching nutritionist profile | userId=${userId}`);
    return this._nutritionistProfileRepository.findByUserId(userId);
  }
  
  async approveNutritionist(userId: string): Promise<void> {
    logger.warn(`Approving nutritionist | userId=${userId}`);
    const user = await this._adminNutritionistRepository.updateById(userId, {
      nutritionistStatus: "approved",
      rejectionReason: "",
    });
    if (!user) {
      logger.error(`Approve failed | user not found | userId=${userId}`);
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    await this._notificationRepository.createNotification({
      title: "Your profile has been approved",
      message: "Congratulations! Your nutritionist profile is now approved.",
      type: "success",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    });
    logger.info(`Nutritionist approved successfully | userId=${userId}`);
  }
  
  async rejectNutritionist(userId: string, reason: string): Promise<void> {
    logger.warn(`Rejecting nutritionist | userId=${userId}, reason=${reason}`);
    const user = await this._adminNutritionistRepository.updateById(userId, {
      nutritionistStatus: "rejected",
      rejectionReason: reason,
    });
    if (!user) {
      logger.error(`Reject failed | user not found | userId=${userId}`);
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    await this._notificationRepository.createNotification({
      title: "Your profile has been rejected",
      message: `Reason: ${reason}`,
      type: "error",
      recipientType: "user",
      receiverId: userId,
      senderId: process.env.ADMIN_ID!,
    });
    logger.info(`Nutritionist rejected | userId=${userId}`);
  }
  
  async getNutritionistProfile(userId: string): Promise<AdminNutritionistProfileDTO> {
    logger.info(`Fetching full nutritionist profile | userId=${userId}`);
    const user = await this._adminNutritionistRepository.findById(userId);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const details = await this._nutritionistProfileRepository.findByUserId(userId);
    if (!details) {
      throw new CustomError("Nutritionist details not found",StatusCode.NOT_FOUND);
    }
    return new AdminNutritionistProfileDTO(user, details);
  }
  
  async updateNutritionistLevel(nutritionistId: string,level: NutritionistLevel): Promise<void> {
    logger.warn(`Updating nutritionist level | nutritionistId=${nutritionistId}, level=${level}`);
    const profile = await this._nutritionistProfileRepository.updateNutritionistLevel(
      nutritionistId,
      level
    );
    if (!profile) {
      logger.error(`Update nutritionist level failed | profile not found | id=${nutritionistId}`);
      throw new CustomError("Nutritionist profile not found",StatusCode.NOT_FOUND);
    }
    logger.info(`Nutritionist level updated successfully | nutritionistId=${nutritionistId}`);
  }
  
}
