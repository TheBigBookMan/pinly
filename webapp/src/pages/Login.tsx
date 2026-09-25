import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import type { AuthContextType } from "@/types/auth"

const Login = () => {
  const {login, isLoading, googleLogin}: AuthContextType = useAuth();

  const validateSubmit = () => {
    console.log("validate");
    console.log(isLoading);
    login('asd', {id: '123', email: 'test@ben.com'});
  }

  const validateGoogle = () => {
    googleLogin();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted px-6">
      {/* soft accent glow behind the card */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-semibold">P</span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Pinly account.
        </p>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-accent hover:underline">
                Forgot password?
              </a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <Button onClick={validateSubmit} type="submit" className="w-full">
            {!isLoading ? <p>Sign in</p> : <Spinner />}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-6">
          <Button onClick={() => validateGoogle()} variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Pinly?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login;