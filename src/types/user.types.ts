export type UserRole = 'alumno' | 'worker' | 'admin';

export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  studentCode?: string;
  faculty?: string;
  career?: string;
  specialty?: string;
  department?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone: string;
  studentCode?: string;
  faculty?: string;
  career?: string;
  specialty?: string;
  department?: string;
}