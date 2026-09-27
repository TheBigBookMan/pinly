import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RotatingGlobe from "@/components/features/HomePage/RotatingGlobe";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

const HomePage = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  return (
    <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <RotatingGlobe />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 px-6">
        <h1 className="text-center text-2xl font-semibold text-foreground">
          Where are you headed?
        </h1>
        <div className='flex gap-2 items-center text-muted-foreground'>
          <h2>
            Works with 
          </h2>
          <FaInstagram />
          <FaTiktok />
          <FaYoutube />
        </div>
        <div className="flex w-full gap-2">
          <Input
            placeholder="Drop a URL here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button className='cursor-pointer' onClick={() => navigate("/map")}>Go</Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage