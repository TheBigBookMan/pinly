import { ApiError, refreshSession, setSessionEndedHandler } from "@/lib/api";
import type { UserType } from "@/types/auth";
import { QueryClient, queryOptions } from "@tanstack/react-query";

export const authKeys = {session: ["auth", "session"] as const};

async function restoreSession(): Promise<UserType | null> {
  try {
    return (await refreshSession()).user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export const sessionQuery = queryOptions({
  queryKey: authKeys.session,
  queryFn: restoreSession,
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false
});

export async function endSession(queryClient: QueryClient) {
  await queryClient.cancelQueries();
  queryClient.removeQueries({predicate: (query: any) => query.querykey[0] !== authKeys.session[0]});
  queryClient.setQueryData(authKeys.session, null);
}

export function listenForSessionEnd(queryClient: QueryClient) {
  setSessionEndedHandler(() => void endSession(queryClient));
}