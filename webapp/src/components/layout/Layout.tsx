import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background bg-[radial-gradient(60%_40%_at_50%_0%,hsl(217_91%_60%/0.12),transparent)]">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}