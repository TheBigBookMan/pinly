import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys, endSession, sessionQuery } from "./session";
import { loginRequest, logoutRequest, registerRequest } from "./api";

export const useSession = () => useQuery(sessionQuery);

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => queryClient.setQueryData(authKeys.session, user)
  })
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {email: string; username: string; password: string}) => {
      await registerRequest(input);
      return loginRequest({email: input.email, password: input.password});
    },
    onSuccess: (user) => queryClient.setQueryData(authKeys.session, user)
  })
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest().catch(() => {}),
    onSettled: () => endSession(queryClient)
  })
}