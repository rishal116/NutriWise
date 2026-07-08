import axios from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  code?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getErrorCode = (error: unknown): string | undefined => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.code;
  }

  return undefined;
};
