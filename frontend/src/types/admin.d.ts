export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
  isBlocked: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
}

export interface Nutritionist {
  _id: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
}
