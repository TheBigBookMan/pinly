import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import type { AuthContextType } from "@/types/auth"
import { useState } from "react"

const Login = () => {
  const {login, isLoading, googleLogin}: AuthContextType = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log("validate");
    console.log(isLoading);
    login('asd', {id: '123', email: 'test@ben.com', username: 'ben smerd'});
  }

  const validateGoogle = () => {
    googleLogin();
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

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full rounded-xl">
            Sign in
          </Button>
        </form>

        <div className="my-6 border-t border-dashed border-border" />

        <Button onClick={() => validateGoogle()} variant="secondary" className="w-full rounded-xl">
          Continue with Google
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