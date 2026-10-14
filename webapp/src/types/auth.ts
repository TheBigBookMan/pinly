export type UserType = {
  id: string;
  username: string;
  email: string;
}

export type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  login: (token: string, userData: UserType) => void;
  googleLogin: () => void;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

export type AuthResponse = {
  accessToken: string;
  expiresIn: number;
  user: UserType;
}