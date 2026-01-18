export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilPic: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}