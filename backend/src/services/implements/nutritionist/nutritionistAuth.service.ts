import { inject, injectable } from "inversify";
import { INutritionistAuthService } from "../../interfaces/nutritionist/INutritionistAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { TYPES } from "../../../types/types";
import { Request } from "express";
import { Types } from "mongoose";
import { NotificationDto } from "../../../dtos/common/notification.dto";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "../../../utils/cloudinaryUploads";
import { NutritionistDetailsUpdateDto, NutritionistRejectionDTO } from "../../../dtos/nutritionist/nutritionistAuth.dto";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { NutritionistNameDTO } from "../../../dtos/nutritionist/nutritionistAuth.dto";
import { NutritionistMapper } from "../../../mapper/nutritionist/nutritionistAuth.mapper";

interface NutritionistFiles {
  cv?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
}

@injectable()
export class NutritionistAuthService implements INutritionistAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _nutritionistAuthRepository: IUserRepository,
    @inject(TYPES.INotificationRepository) private _notificationRepository: INotificationRepository,
    @inject(TYPES.INutritionistProfileRepository) private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}
  
  async submitDetails(req: Request, userId: string): Promise<{ success: boolean; message: string }> {
    const { bio,country } = req.body;
    if (!country) throw new Error("Country is required");
    const qualification = req.body["qualification[]"] || req.body.qualification;
    const specialization = req.body["specialization[]"] || req.body.specialization;
    const normalizedQualification = Array.isArray(qualification) ? qualification : [qualification];
    const normalizedSpecialization = Array.isArray(specialization) ? specialization : [specialization];
    const languagesField = req.body["languages[]"] || req.body.languages;
    const normalizedLanguages = Array.isArray(languagesField) ? languagesField : [languagesField];
    const experiencesField = req.body["experience"] || req.body.experience;
    const experiences = Array.isArray(experiencesField) ? experiencesField.map((exp: any) => ({
      role: exp.role || "",
      organization: exp.organization || "",
      years: Math.max(0, Number(exp.years) || 0),
    })) : [];
    experiences.forEach((exp, i) => {
      if (exp.years <= 0) throw new Error(`Experience years for entry ${i + 1} must be greater than 0`);
    });
    const totalExperienceYears = experiences.reduce((sum, exp) => sum + exp.years, 0);
    const files = req.files as unknown as NutritionistFiles;
    let cvUrl: string | undefined;
    if (files?.cv?.length) cvUrl = await uploadToCloudinary(files.cv[0], "nutritionist/cv");
    let certUrls: string[] = [];
    if (files?.certifications?.length) certUrls = await uploadMultipleToCloudinary(files.certifications, "nutritionist/certifications");
    const payload: NutritionistDetailsUpdateDto = {
      qualifications: normalizedQualification,
      specializations: normalizedSpecialization,
      bio,
      languages: normalizedLanguages,
      experiences,
      totalExperienceYears,
      country,
      cv: cvUrl,
      certifications: certUrls,
    };
    const userObjectId = new Types.ObjectId(userId);
    const existingDetails = await this._nutritionistProfileRepository.findByUserId(userId);
    if (existingDetails) {
      await this._nutritionistProfileRepository.updateByUserId(userId, payload);
    } else {
      await this._nutritionistProfileRepository.create({
        userId: userObjectId,
        ...payload,
      });
    }
    await this._nutritionistAuthRepository.updateById(userId, {
      nutritionistStatus: "pending",
      rejectionReason: "",
    });
    const nutritionist = await this._nutritionistAuthRepository.findById(userId);
    if (!nutritionist) throw new Error("Nutritionist not found");
    const notification: NotificationDto = {
      title: "New Nutritionist Profile Submitted",
      message: `Nutritionist ${nutritionist.fullName} has submitted their profile. Please review and approve.`,
      type: "info",
      senderId: nutritionist._id!.toString(),
      recipientType: "admin",
      receiverId: process.env.ADMIN_ID!,
    };
    await this._notificationRepository.createNotification(notification);
    return { success: true, message: "Details saved successfully" };
  }
  
  
  async getRejectionReason(userId: string): Promise<NutritionistRejectionDTO> {
    const user = await this._nutritionistAuthRepository.findById(userId);
    if (!user) {
      throw new Error("Nutritionist not found");
    }
    return new NutritionistRejectionDTO(user);
  }
  
  
  async getName(userId: string): Promise<NutritionistNameDTO> {
    const user = await this._nutritionistAuthRepository.findById(userId);
    if (!user) {
      throw new Error("Nutritionist not found");
    }
    const nutritionistProfile = await this._nutritionistProfileRepository.findByUserId(userId);
    return NutritionistMapper.toNameDTO(user,nutritionistProfile ?? undefined );
  }

}
