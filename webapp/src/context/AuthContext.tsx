import type { UserType, AuthContextType } from "@/types/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (token: string, userData: UserType): void => {
    // Temp auth login
    setIsLoading(true)
    console.log('login');
    setTimeout(() => {
      console.log("timeout done");
      setIsLoading(false)
    }, 5000);
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  const googleLogin = (): void => {
    console.log("google login");
  };

  const logout = (): void => {
    localStorage.setItem('auth_token', '');
    setUser(null);
  };

  useEffect(() => {
    const initialiseAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        console.log(token);
        if(token) {
          // api call temp
          setUser({
            id: '1234',
            email: 'test@gmail.com'
          })
        }
      } catch (err) {
        console.error('Auth error');
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    }

    initialiseAuth();
  }, []);

  return (
    <AuthContext.Provider value={{user, isLoading, login, googleLogin, logout}}>
      {children}
    </AuthContext.Provider>
  )
}