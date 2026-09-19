import type { UserType } from "@/types/auth";

export const useAuth = () => {
  // temp
  const isLoading = false;
  const user: UserType = {
    email: 'test@gmail.com',
    id: '123'
  }

  return {isLoading, user};
}