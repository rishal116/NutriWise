import { UpdateUserProfileDto } from "../../dtos/user/userProfile.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";
import { Gender } from "../../models/user.model";

const NAME_REGEX = /^[A-Za-z ]{2,50}$/;
const ALLOWED_GENDERS: readonly Gender[] = [
  "male",
  "female",
  "other",
];

export const validateUpdateProfile = (data: UpdateUserProfileDto): void => {
    if (data.fullName !== undefined) {
        const userName = data.fullName.trim();
        if (!userName) {
            throw new CustomError("Full name cannot be empty",StatusCode.BAD_REQUEST);
        }
        if (!NAME_REGEX.test(userName)) {
            throw new CustomError(
                "Full name must contain only letters and spaces (2–50 chars)",StatusCode.BAD_REQUEST);
        }
        const nameParts = userName.split(/\s+/);
        if (nameParts.length > 3) {
            throw new CustomError("Full name can contain at most 3 words",StatusCode.BAD_REQUEST);
        }
    }
    
    if (data.phone === undefined) {
        throw new CustomError("Phone number must have",StatusCode.BAD_REQUEST);
    }
    
    if (data.gender !== undefined) {
        const gender = data.gender.toLowerCase() as Gender;
        if (!ALLOWED_GENDERS.includes(gender)) {
            throw new CustomError("Gender must be male, female, or other",StatusCode.BAD_REQUEST);
        }
    }
    
    if (data.birthdate !== undefined) {
        const birthDateObj = new Date(data.birthdate);
        if (isNaN(birthDateObj.getTime())) {
            throw new CustomError("Invalid birthdate format",StatusCode.BAD_REQUEST);
        }
        const today = new Date();
        if (birthDateObj > today) {
            throw new CustomError("Birthdate cannot be in the future",StatusCode.BAD_REQUEST);
        }
        const age = today.getFullYear() - birthDateObj.getFullYear();
        if (age > 120) {
            throw new CustomError("Birthdate is not realistic",StatusCode.BAD_REQUEST);
        }
    }

};