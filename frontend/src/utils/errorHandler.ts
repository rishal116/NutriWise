

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
  meta?: unknown;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    return (
      data?.message ||
      error.response?.statusText ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

import axios, { AxiosError } from "axios";

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error);
};

