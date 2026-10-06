import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, Home, MapPin, Map, User, Settings, LogOut, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/hooks/useAuth"
import type { AuthContextType } from "@/types/auth"

const navItems: {label: string, to: string, icon: LucideIcon}[] = [
  { label: "Home", to: "/homepage", icon: Home },
  { label: "Map", to: "/map", icon: Map },
  { label: "Pins", to: "/pins", icon: MapPin },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: Settings },
]

const Navbar = () => {
  const {logout}: AuthContextType = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = () => {
    const confirmation = confirm("Are you sure you want to logout?");

    if (!confirmation) return;

    logout();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <NavLink to="/homepage" className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-semibold">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Pinly</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button variant="ghost" size="sm" className="cursor-pointer text-[13px] text-muted-foreground">
            Sign out
          </Button>
        </div>

    {/* Sheet stays as is */}

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col p-0">
            <SheetHeader className="px-6 pb-4 pt-6">
              <SheetTitle className="flex items-center gap-2 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">P</span>
                </div>
                <span className="text-lg font-semibold">Pinly</span>
              </SheetTitle>
              <p className="pl-11 text-sm text-muted-foreground">
                Where to next?
              </p>
            </SheetHeader>

            <div className="mx-6 border-t border-dashed border-border" />

            <nav className="flex flex-1 flex-col gap-1.5 px-4 py-5">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? "bg-accent-foreground/15"
                            : "bg-accent/10 text-accent group-hover:bg-accent/20"
                        }`}
                      >
                        <Icon className="size-4" />
                      </span>
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mx-6 border-t border-dashed border-border" />

            <div className="px-4 py-5">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <LogOut className="size-4" />
                </span>
                Sign out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Navbar;