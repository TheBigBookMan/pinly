import type { AuthContextType } from "@/types/auth";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const context: AuthContextType | undefined = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be used within Auth provider");
  }

  return context;
}