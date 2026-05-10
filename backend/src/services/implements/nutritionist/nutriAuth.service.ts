import { inject, injectable } from "inversify";
import { INutritionistAuthService } from "../../interfaces/nutritionist/INutritionistAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { TYPES } from "../../../types/types";
import { Request } from "express";
import { Types } from "mongoose";

import { NotificationDto } from "../../../dtos/common/notification.dto";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "../../../utils/cloudinaryUploads";

import {
  NutritionistDetailsUpdateDto,
  NutritionistRejectionDTO,
  NutritionistDetailsDTO,
  NutritionistNameDTO,
} from "../../../dtos/nutritionist/nutritionistAuth.dto";

import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { NutritionistMapper } from "../../../mapper/nutritionist/nutritionistAuth.mapper";
import { CustomError } from "../../../utils/customError";

interface NutritionistFiles {
  cv?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
}

@injectable()
export class NutritionistAuthService implements INutritionistAuthService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}

  // ─────────────────────────────────────────────
  // Get Nutritionist Details
  // ─────────────────────────────────────────────
  async getMyDetails(userId: string): Promise<NutritionistDetailsDTO> {
    const profile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    if (!profile) {
      throw new CustomError("Nutritionist profile not found");
    }

    return {
      qualifications: profile.qualifications,
      specializations: profile.specializations,
      experiences: profile.experiences,
      languages: profile.languages,
      bio: profile.bio,
      cvUrl: profile.cv,
      certificationUrls: profile.certifications,
    };
  }

  // ─────────────────────────────────────────────
  // Submit / Reapply Nutritionist Profile
  // ─────────────────────────────────────────────
  async submitDetails(
    req: Request,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const { bio } = req.body;

    // Qualifications
    const qualificationRaw =
      req.body["qualification[]"] ?? req.body.qualification;

    const normalizedQualification: string[] = Array.isArray(qualificationRaw)
      ? qualificationRaw.map(String)
      : qualificationRaw
        ? [String(qualificationRaw)]
        : [];

    // Specializations
    const specializationRaw =
      req.body["specialization[]"] ?? req.body.specialization;

    const normalizedSpecialization: string[] = Array.isArray(specializationRaw)
      ? specializationRaw.map(String)
      : specializationRaw
        ? [String(specializationRaw)]
        : [];

    // Languages
    const languagesRaw = req.body["languages[]"] ?? req.body.languages;

    const normalizedLanguages: string[] = Array.isArray(languagesRaw)
      ? languagesRaw.map(String)
      : languagesRaw
        ? [String(languagesRaw)]
        : [];

    // Experiences
    interface RawExperience {
      role?: string;
      organization?: string;
      years?: string | number;
    }

    const experiencesRaw = req.body.experience as
      | RawExperience[]
      | RawExperience
      | undefined;

    const normalizedExperiencesArray: RawExperience[] = Array.isArray(
      experiencesRaw,
    )
      ? experiencesRaw
      : experiencesRaw
        ? [experiencesRaw]
        : [];

    const experiences = normalizedExperiencesArray.map((exp) => ({
      role: exp.role?.trim() || "",
      organization: exp.organization?.trim() || "",
      years: Math.max(0, Number(exp.years) || 0),
    }));

    experiences.forEach((exp, index) => {
      if (exp.years <= 0) {
        throw new CustomError(
          `Experience ${index + 1} years must be greater than 0`,
        );
      }
    });

    const totalExperienceYears = experiences.reduce(
      (sum, exp) => sum + exp.years,
      0,
    );

    // Files
    const files = req.files as NutritionistFiles;

    let cvUrl: string | undefined;
    let certUrls: string[] = [];

    if (files?.cv?.length) {
      cvUrl = await uploadToCloudinary(files.cv[0], "nutritionist/cv");
    }

    if (files?.certifications?.length) {
      certUrls = await uploadMultipleToCloudinary(
        files.certifications,
        "nutritionist/certifications",
      );
    }

    // Payload
    const payload: NutritionistDetailsUpdateDto = {
      qualifications: normalizedQualification,
      specializations: normalizedSpecialization,
      bio: String(bio || ""),
      languages: normalizedLanguages,
      experiences,
      totalExperienceYears,
      cv: cvUrl,
      certifications: certUrls,
    };

    // Existing profile check
    const existingProfile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    if (existingProfile) {
      await this._nutritionistProfileRepository.updateByUserId(userId, {
        ...payload,
        verificationStatus: "pending",
        rejectionReason: "",
      });
    } else {
      await this._nutritionistProfileRepository.create({
        userId: new Types.ObjectId(userId),
        ...payload,
        verificationStatus: "pending",
        rejectionReason: "",
        profileCompleted: true,
      });
    }

    // Notify admin
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    const notification: NotificationDto = {
      title: "New Nutritionist Profile Submitted",
      message: `Nutritionist ${user.fullName} has submitted their profile for review.`,
      type: "info",
      senderId: user._id!.toString(),
      recipientType: "admin",
      receiverId: process.env.ADMIN_ID!,
    };

    await this._notificationRepository.createNotification(notification);

    return {
      success: true,
      message: "Nutritionist profile submitted successfully",
    };
  }

  // ─────────────────────────────────────────────
  // Rejection Reason
  // ─────────────────────────────────────────────
  async getRejectionReason(userId: string): Promise<NutritionistRejectionDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    const profile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    return new NutritionistRejectionDTO(user, profile || undefined);
  }

  // ─────────────────────────────────────────────
  // Public Nutritionist Name
  // ─────────────────────────────────────────────
  async getName(userId: string): Promise<NutritionistNameDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError("User not found");
    }

    const profile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    return NutritionistMapper.toNameDTO(user, profile || undefined);
  }
}
