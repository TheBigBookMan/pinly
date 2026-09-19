import type { UserTypes } from "@/types/user";

export const useAuth = () => {
  // temp
  const isLoading = false;
  const user: UserTypes = {
    email: 'test@gmail.com'
  }

  return {isLoading, user};
}