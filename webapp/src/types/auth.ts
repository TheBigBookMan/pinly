export interface UserType {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  login: (token: string, userData: UserType) => void;
  googleLogin: () => void;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}