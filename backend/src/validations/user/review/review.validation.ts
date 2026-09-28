import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { UpdateReviewDTO } from "../../../dtos/user/review/update-review.dto";

export const validateReviewUpdate = (dto: UpdateReviewDTO): void => {
  if (dto.rating === undefined && dto.review === undefined) {
    throw new CustomError(
      "At least one field must be provided to update the review.",
      StatusCode.BAD_REQUEST,
    );
  }
};
