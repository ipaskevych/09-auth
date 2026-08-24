export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
}

export interface AuthResponse {
  user: User;
}