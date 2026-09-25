export interface UserType {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  login: (token: string, userData: UserType) => void;
  googleLogin: () => void;
  logout: () => void;
}