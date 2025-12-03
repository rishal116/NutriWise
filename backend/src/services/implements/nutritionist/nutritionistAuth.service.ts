import { inject, injectable } from "inversify";
import { INutritionistAuthService } from "../../interfaces/nutritionist/INutritionistAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { TYPES } from "../../../types/types";
import { Request } from "express";
import { Types } from "mongoose";
import { NotificationDto } from "../../../dtos/common/notification.dto";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "../../../utils/cloudinaryUploads";
import { NutritionistDetailsUpdateDto } from "../../../dtos/nutritionist/NutritionistAuth.dto";
import { INotificationRepository } from "../../../repositories/interfaces/INotificationRepository";
import { NutritionistProfileDto } from "../../../dtos/nutritionist/nutritionistProfile";

interface NutritionistFiles {
  cv?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
}

@injectable()
export class NutritionistAuthService implements INutritionistAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _nutritionistRepository: IUserRepository,
    @inject(TYPES.INotificationRepository) private _notificationRepository: INotificationRepository,
    @inject(TYPES.INutritionistDetailsRepository) private _nutritionistDetailsRepository: INutritionistDetailsRepository,
  ) {}
  

  async submitDetails(req: Request, userId: string): Promise<{ success:boolean; message: string}> {
    const { bio, videoCallRate, consultationDuration } = req.body;
    console.log("submitDetails: ",req.body);
    console.log("files: ",req.file);
    console.log("files21 : ",req.files);
    
    const stateField = req.body["location[state]"] || req.body.state;
    const cityField = req.body["location[city]"] || req.body.city;
    if (!stateField || !cityField) {
      throw new Error("State and City are required");
    }
    const location = {
      state: stateField,
      city: cityField,
    };
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
      years: Math.max(0, Number(exp.years) || 0)
    })) : [];
    experiences.forEach((exp, i) => {
      if (exp.years <= 0) throw new Error(`Experience years for entry ${i + 1} must be greater than 0`);
    });
    const totalExperienceYears = experiences.reduce((sum, exp) => sum + exp.years, 0);
    const rate = Number(videoCallRate);
    if (isNaN(rate) || rate <= 0) throw new Error("Video Call Rate must be greater than 0");
    experiences.forEach((exp, i) => {
      if (exp.years <= 0) throw new Error(`Experience years for entry ${i + 1} must be greater than 0`);
    });
    const files = req.files as unknown as NutritionistFiles;
    let cvUrl: string | undefined;
    if (files.cv?.length) cvUrl = await uploadToCloudinary(files.cv[0], "nutritionist/cv");
    let certUrls: string[] = [];
    if (files.certifications?.length) certUrls = await uploadMultipleToCloudinary(files.certifications, "nutritionist/certifications");
    const payload: NutritionistDetailsUpdateDto = {
      qualifications: normalizedQualification,
      specializations: normalizedSpecialization,
      bio,
      languages: normalizedLanguages,
      videoCallRate: rate,
      consultationDuration,
      location,
      experiences,
      totalExperienceYears,
      cv: cvUrl,
      certifications: certUrls
    };
    payload.experiences = experiences;
    payload.totalExperienceYears = totalExperienceYears;
    if (cvUrl) payload.cv = cvUrl;
    if (certUrls.length) payload.certifications = certUrls;
    const userObjectId = new Types.ObjectId(userId);
    const existingDetails = await this._nutritionistDetailsRepository.findByUserId(userId);
    console.log("payload: ",payload);
    
    if (existingDetails) {
      await this._nutritionistDetailsRepository.updateDetails(userId, payload);
    } else {
      await this._nutritionistDetailsRepository.createDetails({
        userId: userObjectId,
        ...payload
      });
    }
    await this._nutritionistRepository.updateById(userId, {
      nutritionistStatus: "pending",
      rejectionReason: ""
    });
    const nutritionist = await this._nutritionistRepository.findById(userId);
    if (!nutritionist) throw new Error("Nutritionist not found");
    const notification: NotificationDto = {
      title: "New Nutritionist Profile Submitted",
      message: `Nutritionist ${nutritionist.fullName} has submitted their profile. Please review and approve.`,
      type: "info",
      senderId: nutritionist._id!.toString(),
      recipientType: "admin",
      receiverId: process.env.ADMIN_ID!,
    }
    await this._notificationRepository.createNotification(notification);
    return { success: true, message: "Details saved successfully"};
  }
  

  async approveNutritionist(userId: string): Promise<void> {
    const user = await this. _nutritionistRepository.updateById(userId, { nutritionistStatus: "approved" });
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
    const user = await this. _nutritionistRepository.updateById(userId, { nutritionistStatus: "rejected" });
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
  
 

}
