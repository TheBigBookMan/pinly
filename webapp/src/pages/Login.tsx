import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { googleSignInUrl } from "@/features/auth/google"
import { useLogin } from "@/features/auth/hooks"
import { messageOf } from "@/lib/api"
import { useState, type FormEvent } from "react"
import { useLocation, useSearchParams } from "react-router-dom"

const OAUTH_MESSAGES: Record<string, string> = {
  account_exists: "An account with that email already exists. Sign in with your password instead.",
  email_not_verified: "Google has not verified that email address, so we cannot use it.",
  oauth_cancelled: "Google sign-in was cancelled.",
  oauth_failed: "Google sign-in did not complete. Please try again."
};

const Login = () => {
  const login = useLogin();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [params] = useSearchParams();
  const code = params.get("error");
  const oauthError = code && Object.hasOwn(OAUTH_MESSAGES, code) ? OAUTH_MESSAGES[code] : null;
  const from = (useLocation().state);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({email, password});
  }

  const validateGoogle = () => {
    console.log("GOOGLE");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted px-6">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-lg font-semibold">P</span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick up right where you left off.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-accent hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {login.isError && <p className="text-sm text-destructive">{messageOf(login.error)}</p>}

          <Button type="submit" className="w-full rounded-xl" disabled={login.isPending}>
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-6 border-t border-dashed border-border" />

        {oauthError && <p role="alert" className="text-sm text-destructive">{oauthError}</p>}

        <Button asChild variant="secondary" className="w-full rounded-xl">
          <a href={googleSignInUrl(from)}>Continue with Google</a>
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <a href="/register" className="font-medium text-accent hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login;