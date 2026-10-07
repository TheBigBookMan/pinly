import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RotatingGlobe from "@/components/features/HomePage/RotatingGlobe"
import Starfield from "@/components/features/HomePage/Starfield"
import LinkResultDialog from "@/components/features/HomePage/LinkResultDialog"
import { detectLinkKind } from "@/utils/mapLinks"

const HomePage = () => {
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    if (!detectLinkKind(trimmed)) {
      setError("Paste a TikTok, Instagram or YouTube Shorts link.")
      return
    }

    setError(null)
    setDialogOpen(true)
  }

  return (
    <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-background">
      <Starfield />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <RotatingGlobe />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 px-6"
      >
        <h1 className="text-center text-2xl font-semibold text-foreground">
          Saw somewhere worth saving?
        </h1>
        <div className="flex w-full gap-2">
          <Input
            placeholder="Paste a video or map link"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError(null)
            }}
            aria-invalid={!!error}
            className="flex-1"
          />
          <Button type="submit" disabled={!url.trim()}>
            Add
          </Button>
        </div>
        {error && <div className="w-full text-sm text-destructive">{error}</div>}
      </form>

      <LinkResultDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        url={url.trim()}
        onComplete={() => setUrl("")}
        onScanMore={() => {
          // TODO: ask the backend for a deeper scan
        }}
        onAddManually={() => {
          // TODO: open AddPinDialog with this link pre-filled
        }}
      />
    </div>
  )
}

export default HomePage