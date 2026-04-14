

export interface AuthSuccessResponse {
  success: true;
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "client" | "nutritionist" | "admin";
    isBlocked: boolean;
  };
}

export interface GoogleAuthPayload {
  credential: string; // from Google
}