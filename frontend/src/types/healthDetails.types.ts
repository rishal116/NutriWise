
export interface HealthDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
  };
}