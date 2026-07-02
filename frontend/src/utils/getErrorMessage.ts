import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message: string }>(error)) {
    return error.response?.data?.message || error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as { message: string }).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};
