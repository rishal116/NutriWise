export interface CreateCheckoutSessionRequestDTO {
  planId: string;
}

export interface CreateCheckoutSessionResponseDTO {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
  };
}