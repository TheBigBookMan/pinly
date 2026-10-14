import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { useRegister } from "@/features/auth/hooks"
import { ApiError, messageOf } from "@/lib/api"

const Register = () => {
  const register = useRegister();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [mismatch, setMismatch] = useState<boolean | string>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMismatch("Passwords don't match.");
      return;
    }

    setMismatch(false);
    register.mutate({email, username, password});
  }

  const error = register.error;
  const emailError = error instanceof ApiError && error.code === "email_taken" ? error.message : undefined;
  const usernameError = error instanceof ApiError && error.code === "username_ taken" ? error.message : undefined;
  const generalError = mismatch 
    ? "Passwords don't match."
    : register.isError && !emailError && !usernameError
      ? messageOf(error)
      : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted px-6">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-lg font-semibold">P</span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-foreground">Start your map</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save it now, find it later.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Jane Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              aria-invalid={!!usernameError}
              aria-describedby={usernameError ? "username-error" : undefined}
            />
            {usernameError && <p id="username-error" role="alert" className="text-sm text-destructive">{usernameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && <p id="email-error" role="alert" className="text-sm text-destructive">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={12}
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs text-muted-foreground">At least 12 characters. A phrase works well.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {generalError && <p role="alert" className="text-sm text-destructive">{generalError}</p>}
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={register.isPending}>
            {register.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="my-6 border-t border-dashed border-border" />

        <Button variant="secondary" className="w-full rounded-xl">
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register;