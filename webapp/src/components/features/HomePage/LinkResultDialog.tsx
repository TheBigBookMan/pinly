import { useEffect, useState } from "react"
import { Check, MapPin, MapPinOff, PencilLine, RotateCw, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { resolveLink, type PlaceCandidate, type ResolveResult } from "@/utils/resolveLink"
import type { NoMatchReason } from "@/utils/mapLinks"

type ActionHandlers = {
  onRetry: () => void
  onScanMore: () => void
  onAddManually: () => void
}

const headerClass = "items-center text-center sm:text-center"

const loadingSteps = ["Reading the link...", "Looking for places...", "Matching locations..."]

function LoadingView() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setStep((s) => Math.min(s + 1, loadingSteps.length - 1)),
      1000
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <DialogHeader className={headerClass}>
        <DialogTitle>Finding your place</DialogTitle>
        <DialogDescription>This usually takes a few seconds.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center gap-5 py-6">
        <div className="relative flex size-20 items-center justify-center">
          <span className="absolute size-full animate-ping rounded-full bg-primary/20 motion-reduce:animate-none" />
          <span className="absolute size-14 animate-ping rounded-full bg-primary/30 [animation-delay:400ms] motion-reduce:animate-none" />
          <span className="relative flex size-12 items-center justify-center rounded-full border border-border bg-card text-xl">
            📍
          </span>
        </div>
        <div key={step} className="animate-in fade-in text-sm text-muted-foreground">
          {loadingSteps[step]}
        </div>
      </div>
    </>
  )
}

const noMatchCopy: Record<NoMatchReason, { title: string; description: string }> = {
  apple_short: {
    title: "Can't read this Apple Maps link",
    description:
      "Apple's short share links don't include the location. Search for the place by name instead, or share it from Google Maps.",
  },
  map_no_coordinates: {
    title: "No exact place in this link",
    description:
      "This map link points to a search, not a specific place. Add the place yourself and we'll pin it.",
  },
  expand_failed: {
    title: "Couldn't open this link",
    description: "Check that it's a Google Maps share link, or add the place yourself.",
  },
}

function NoMatchView({
  reason,
  onRetry,
  onScanMore,
  onAddManually,
}: ActionHandlers & { reason?: NoMatchReason }) {
  const copy = reason
    ? noMatchCopy[reason]
    : {
        title: "Couldn't match a place",
        description:
          "There wasn't enough data in this link to work out where it is. You can try again, scan deeper, or add it yourself.",
      }

  return (
    <>
      <DialogHeader className={headerClass}>
        <div className="mb-1 flex size-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
          <MapPinOff className="size-5" />
        </div>
        <DialogTitle>{copy.title}</DialogTitle>
        <DialogDescription>{copy.description}</DialogDescription>
      </DialogHeader>

      {/* flex-col-reverse puts the primary action on top on mobile and last on desktop */}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
        {/* Retrying or scanning deeper can't fix a map link that has no place in it */}
        {!reason && (
          <>
            <Button variant="secondary" className="sm:flex-1" onClick={onRetry}>
              <RotateCw className="size-4" />
              Retry
            </Button>
            <Button variant="secondary" className="sm:flex-1" onClick={onScanMore}>
              <ScanSearch className="size-4" />
              Scan more
            </Button>
          </>
        )}
        <Button className="sm:flex-1" onClick={onAddManually}>
          <PencilLine className="size-4" />
          Add manually
        </Button>
      </div>
    </>
  )
}

function SuccessView({ place, onDone }: { place: PlaceCandidate; onDone: () => void }) {
  // Map links carry no region or country until reverse geocoding exists, so fall back to the coordinates.
  const where =
    [place.region, place.country].filter(Boolean).join(", ") ||
    `${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}`

  return (
    <>
      <DialogHeader className={headerClass}>
        <div className="mb-1 flex size-12 animate-in zoom-in-50 items-center justify-center rounded-full bg-primary/15 text-primary duration-300">
          <Check className="size-6" strokeWidth={3} />
        </div>
        <DialogTitle>Successfully added</DialogTitle>
        <DialogDescription>
          {place.name} · {where}
        </DialogDescription>
      </DialogHeader>

      <Button onClick={onDone}>Done</Button>
    </>
  )
}

function DuplicateView({ pinName, onClose }: { pinName: string; onClose: () => void }) {
  return (
    <>
      <DialogHeader className={headerClass}>
        <div className="mb-1 flex size-12 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
          <MapPin className="size-5" />
        </div>
        <DialogTitle>You already have this pin created</DialogTitle>
        <DialogDescription>{pinName} is already on your map.</DialogDescription>
      </DialogHeader>

      <Button onClick={onClose}>Got it</Button>
    </>
  )
}

function MultipleView({
  candidates,
  onConfirm,
  onRetry,
  onScanMore,
  onAddManually,
}: ActionHandlers & { candidates: PlaceCandidate[]; onConfirm: (place: PlaceCandidate) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = candidates.find((c) => c.id === selectedId)

  return (
    <>
      <DialogHeader className={headerClass}>
        <DialogTitle>Which one is it?</DialogTitle>
        <DialogDescription>We found a few possible places. Pick the right one.</DialogDescription>
      </DialogHeader>

      <div role="radiogroup" aria-label="Possible places" className="flex flex-col gap-2 py-1">
        {candidates.map((candidate) => {
          const isSelected = candidate.id === selectedId
          return (
            <button
              key={candidate.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedId(candidate.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/40 hover:border-foreground/20 hover:bg-secondary"
              )}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{candidate.name}</div>
                <div className="text-xs text-muted-foreground">
                  {candidate.region}, {candidate.country}
                </div>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                )}
              >
                {isSelected && <Check className="size-3" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <Button disabled={!selected} onClick={() => selected && onConfirm(selected)}>
        Confirm place
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RotateCw className="size-3.5" />
          Retry
        </Button>
        <Button variant="ghost" size="sm" onClick={onScanMore}>
          <ScanSearch className="size-3.5" />
          Scan more
        </Button>
        <Button variant="ghost" size="sm" onClick={onAddManually}>
          <PencilLine className="size-3.5" />
          Add manually
        </Button>
      </div>
    </>
  )
}

type FlowState = { phase: "loading" } | { phase: "result"; result: ResolveResult }

type FlowProps = {
  url: string
  onComplete: () => void
  onScanMore: () => void
  onAddManually: () => void
}

function LinkResultFlow({ url, onComplete, onScanMore, onAddManually }: FlowProps) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<FlowState>({ phase: "loading" })

  useEffect(() => {
    let cancelled = false
    resolveLink(url).then((result) => {
      if (!cancelled) setState({ phase: "result", result })
    })
    return () => {
      cancelled = true
    }
  }, [url, attempt])

  const handleRetry = () => {
    setState({ phase: "loading" })
    setAttempt((a) => a + 1)
  }

  if (state.phase === "loading") return <LoadingView />

  const { result } = state
  const actions = { onRetry: handleRetry, onScanMore, onAddManually }

  switch (result.status) {
    case "no_match":
      return <NoMatchView {...actions} />
    case "multiple":
      return (
        <MultipleView
          candidates={result.candidates}
          onConfirm={(place) => setState({ phase: "result", result: { status: "success", place } })}
          {...actions}
        />
      )
    case "success":
      return <SuccessView place={result.place} onDone={onComplete} />
    case "no_match":
      return <NoMatchView reason={result.reason} {...actions} />
    case "duplicate":
      return <DuplicateView pinName={result.pinName} onClose={onComplete} />
  }
}

type LinkResultDialogProps = FlowProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LinkResultDialog({
  open,
  onOpenChange,
  url,
  onComplete,
  onScanMore,
  onAddManually,
}: LinkResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Content unmounts when the dialog closes, so every open starts from the loading state */}
        <LinkResultFlow
          url={url}
          onComplete={() => {
            onComplete()
            onOpenChange(false)
          }}
          onScanMore={onScanMore}
          onAddManually={onAddManually}
        />
      </DialogContent>
    </Dialog>
  )
}