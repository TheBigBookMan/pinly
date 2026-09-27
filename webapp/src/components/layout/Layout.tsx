import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}