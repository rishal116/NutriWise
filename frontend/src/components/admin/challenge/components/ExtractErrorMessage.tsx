interface AxiosLikeError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export function ExtractErrorMessage(err: unknown): string {
  if (typeof err === "string") {
    return err;
  }

  if (err && typeof err === "object") {
    const axiosErr = err as AxiosLikeError;

    const serverMessage =
      axiosErr.response?.data?.message ?? axiosErr.response?.data?.error;

    if (serverMessage) {
      return serverMessage;
    }

    if (axiosErr.message) {
      return axiosErr.message;
    }
  }

  return "Something went wrong. Please try again.";
}
