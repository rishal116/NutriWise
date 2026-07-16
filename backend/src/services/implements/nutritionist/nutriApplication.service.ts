import { inject, injectable } from "inversify";
import { INutritionistApplicationService } from "../../interfaces/nutritionist/INutriApplicationService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutriProfileRepository";
import { TYPES } from "../../../types/types";
import { Types } from "mongoose";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";
import { CustomError } from "../../../utils/customError";
import { NutritionistApplicationDetailsDto } from "../../../dtos/nutritionist/form/nutritionist-details.dto";
import { NutritionistMapper } from "../../../mapper/nutritionist/form/nutritionist.mapper";
import {
  SubmitNutritionistApplicationDto,
  NutritionistFormDto,
} from "../../../dtos/nutritionist/form/nutritionist-form.dto";
import { NutritionistApplicationStatusDto } from "../../../dtos/nutritionist/form/nutritionist-status.dto";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ICertification } from "../../../models/nutritionistProfile.model";
import { UserRole } from "../../../enums/user.enum";
import { NotificationType } from "../../../models/notification.model";

@injectable()
export class NutritionistApplicationService implements INutritionistApplicationService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.INotificationRepository)
    private _notificationRepository: INotificationRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {}

  async getApplicationDetails(
    userId: string,
  ): Promise<NutritionistApplicationDetailsDto> {
    const nutritionist =
      await this._nutritionistProfileRepository.findByUserId(userId);
    if (!nutritionist) {
      throw new CustomError("Nutritionist profile not found");
    }
    return NutritionistMapper.toApplicationDetailsDto(nutritionist);
  }

  async submitApplication(
    dto: SubmitNutritionistApplicationDto,
  ): Promise<void> {
    console.log(dto);
    const { userId, body, files } = dto;

    const parsedBody: NutritionistFormDto = {
      qualifications: JSON.parse(body.qualifications),
      experiences: JSON.parse(body.experiences),
      specializations: JSON.parse(body.specializations),
      languages: JSON.parse(body.languages),
      certifications: JSON.parse(body.certificationMeta ?? "[]"),
      bio: body.bio,
    };
    await validateDto(NutritionistFormDto, parsedBody);

    const {
      qualifications,
      specializations,
      experiences,
      languages,
      bio,
      certifications,
    } = parsedBody;

    const totalExperienceYears = experiences.reduce(
      (sum, experience) => sum + experience.durationYears,
      0,
    );
    const existingProfile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    let resumeUrl = existingProfile?.resumeUrl ?? "";

    if (files?.resume?.length) {
      resumeUrl = await uploadToCloudinary(
        files.resume[0],
        "nutritionist/resume",
      );
    } else if (!resumeUrl) {
      throw new CustomError("Resume is required", StatusCode.BAD_REQUEST);
    }

    let uploadIndex = 0;

    const mappedCertifications: ICertification[] = [];

    for (const certificate of certifications) {
      let certificateUrl = certificate.fileUrl ?? "";

      if (files?.certifications?.[uploadIndex]) {
        certificateUrl = await uploadToCloudinary(
          files.certifications[uploadIndex],
          "nutritionist/certifications",
        );

        uploadIndex++;
      }

      if (!certificateUrl) {
        throw new CustomError(
          "Certificate file is required",
          StatusCode.BAD_REQUEST,
        );
      }

      mappedCertifications.push({
        name: certificate.name,
        issuedBy: certificate.issuedBy,
        certificateUrl,
      });
    }
    const profile = {
      qualifications,
      specializations,
      experiences,
      languages,
      bio,
      resumeUrl,
      certifications: mappedCertifications,
      totalExperienceYears,
    };
    const isReapplication = !!existingProfile;
    if (existingProfile) {
      await this._nutritionistProfileRepository.updateByUserId(userId, {
        ...profile,
        applicationStatus: "pending",
        rejectionReason: "",
      });
    } else {
      await this._nutritionistProfileRepository.create({
        userId: new Types.ObjectId(userId),
        ...profile,
        applicationStatus: "pending",
        rejectionReason: "",
      });
    }
    const nutritionist = await this._userRepository.findById(userId);
    if (!nutritionist) {
      throw new CustomError("Nutritionist not found");
    }

    const admin = await this._userRepository.findOne({
      activeRole: UserRole.ADMIN,
    });
    if (!admin) {
      throw new CustomError("Admin not found");
    }
    await this._notificationRepository.create({
      recipientId: admin._id,
      senderId: nutritionist._id,
      type: NotificationType.INFO,
      title: isReapplication
        ? "Nutritionist Application Resubmitted"
        : "New Nutritionist Application",
      message: isReapplication
        ? `${nutritionist.fullName} resubmitted their nutritionist application for review.`
        : `${nutritionist.fullName} submitted a new nutritionist application for review.`,
      data: {
        applicantId: nutritionist._id.toString(),
      },
    });
  }

  async getApplicationStatus(
    userId: string,
  ): Promise<NutritionistApplicationStatusDto> {
    const nutritionist =
      await this._nutritionistProfileRepository.findByUserId(userId);
    if (!nutritionist) {
      throw new CustomError("Nutritionist profile not found");
    }
    return NutritionistMapper.toApplicationStatusDto(nutritionist);
  }
}
