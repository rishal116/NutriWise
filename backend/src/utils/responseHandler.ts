import { Response } from "express";

import { StatusCode } from "../enums/statusCode.enum";
import { ApiResponseDTO } from "../dtos/common/api-response.dto";

export const sendResponse = <T = null>(
  res: Response,
  statusCode: StatusCode,
  message: string,
  data?: T,
): Response => {
  return res.status(statusCode).json(new ApiResponseDTO(true, message, data));
};
