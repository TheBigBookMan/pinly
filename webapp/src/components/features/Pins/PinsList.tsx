import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ReviewModal from "@/components/shared/ReviewModal"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { ExternalLink, Navigation, Pencil, Trash2, Check, Star } from "lucide-react"
import type { FilterState } from "./PinsFilter"
import VideoModal from "@/components/shared/VideoModal"
import { platformLabel, type SourcePlatform } from "@/utils/embed"
import { Play } from "lucide-react" // add Play to your existing lucide import

type Category = {
  id: string
  name: string
  emoji: string
}

export type Pin = {
  id: string
  name: string
  categoryId: string
  country: string
  distanceKm: number
  lat: number
  lng: number
  status: "want_to_see" | "done"
  sourceUrl?: string
  rating?: number
  note?: string
  pinnedAt: string
  sourcePlatform?: SourcePlatform
  thumbnailUrl?: string
}

const dummyPins: Pin[] = [
  { id: "1", name: "Sunset Rooftop", categoryId: "1", country: "Thailand", distanceKm: 3, lat: 18.7883, lng: 98.9853, status: "want_to_see",  pinnedAt: "2026-09-12", sourceUrl: "https://www.tiktok.com/@example/video/7000000000000000000",
sourcePlatform: "tiktok",
thumbnailUrl: "https://picsum.photos/seed/rooftop/600/450", },
  { id: "2", name: "Nong Khiaw Viewpoint", categoryId: "3", country: "Laos", distanceKm: 420, lat: 20.1667, lng: 102.7, status: "done", rating: 5, note: "Best sunrise of the whole trip.", pinnedAt: "2026-08-02", sourceUrl: "https://www.instagram.com/reel/EXAMPLE123/",
sourcePlatform: "instagram", },
  { id: "3", name: "Doi Suthep Trail", categoryId: "2", country: "Thailand", distanceKm: 12, lat: 18.8048, lng: 98.9217, status: "want_to_see", sourceUrl: "https://instagram.com/reel/example", pinnedAt: "2026-09-20" },
  { id: "4", name: "Pasteis de Belem", categoryId: "4", country: "Portugal", distanceKm: 9500, lat: 38.6975, lng: -9.2033, status: "done", rating: 4, pinnedAt: "2026-07-15" },
]

const formatPinnedDate = (iso: string) => {
  const date = new Date(iso)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`
}

type PinsListProps = {
  categories: Category[]
  filters: FilterState
  filterMode: "distance" | "countries" | null
  selectedCategoryIds: string[];
}

export default function PinsList({ categories, filters, filterMode, selectedCategoryIds }: PinsListProps) {
  const [pins, setPins] = useState<Pin[]>(dummyPins)
  const [editingPin, setEditingPin] = useState<Pin | null>(null)
  const [editName, setEditName] = useState("")
  const [editNote, setEditNote] = useState("")
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [reviewTargetId, setReviewTargetId] = useState<string | null>(null)
  const [confirmCompleteId, setConfirmCompleteId] = useState<string | null>(null)
  const [videoPinId, setVideoPinId] = useState<string | null>(null)

  const handleThumbnailClick = (pin: Pin) => {
    if (!pin.sourceUrl) return
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    if (isMobile) {
      window.open(pin.sourceUrl, "_blank", "noopener,noreferrer")
    } else {
      setVideoPinId(pin.id)
    }
  }

  const videoPin = pins.find((p) => p.id === videoPinId)

  const categoryFor = (id: string) => categories.find((c) => c.id === id)

  const filteredPins = pins.filter((pin) => {
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "completed" && pin.status === "done") ||
      (filters.status === "not_completed" && pin.status === "want_to_see")
    const distanceMatch = filterMode !== "distance" || pin.distanceKm <= filters.distanceKm
    const countryMatch =
      filterMode !== "countries" || filters.countries.length === 0 || filters.countries.includes(pin.country)
    const categoryMatch =
      selectedCategoryIds.length === 0 || selectedCategoryIds.includes(pin.categoryId)

    return statusMatch && distanceMatch && countryMatch && categoryMatch
  })

  const handleToggleClick = (pin: Pin) => {
    if (pin.status === "done") {
      setPins((prev) => prev.map((p) => (p.id === pin.id ? { ...p, status: "want_to_see" } : p)))
    } else {
      setConfirmCompleteId(pin.id)
    }
  }

  const handleConfirmComplete = () => {
    if (!confirmCompleteId) return
    const id = confirmCompleteId
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, status: "done" } : p)))
    setConfirmCompleteId(null)
    setReviewTargetId(id)
  }

  const handleReviewSubmit = (rating: number, note: string) => {
    if (!reviewTargetId) return
    setPins((prev) => prev.map((p) => (p.id === reviewTargetId ? { ...p, rating, note } : p)))
    setReviewTargetId(null)
  }

  const handleDelete = () => {
    if (!deleteTargetId) return
    setPins((prev) => prev.filter((p) => p.id !== deleteTargetId))
    setDeleteTargetId(null)
  }

  const handleCategoryChange = (pinId: string, categoryId: string) => {
    setPins((prev) => prev.map((p) => (p.id === pinId ? { ...p, categoryId } : p)))
  }

  const openEdit = (pin: Pin) => {
    setEditingPin(pin)
    setEditName(pin.name)
    setEditNote(pin.note ?? "")
  }

  const handleEditSave = () => {
    if (!editingPin) return
    setPins((prev) =>
      prev.map((pin) => (pin.id === editingPin.id ? { ...pin, name: editName, note: editNote } : pin))
    )
    setEditingPin(null)
  }

  const openInMaps = (pin: Pin) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`, "_blank", "noopener,noreferrer")
  }

  const pinBeingCompleted = pins.find((p) => p.id === confirmCompleteId)
  const pinBeingReviewed = pins.find((p) => p.id === reviewTargetId)

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPins.map((pin) => {
        const category = categoryFor(pin.categoryId)
        const isDone = pin.status === "done"

        return (
          <div
            key={pin.id}
            className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-secondary"
          >
            {pin.sourceUrl && pin.sourcePlatform && (
              <button
                onClick={() => handleThumbnailClick(pin)}
                className="group/thumb relative mb-3 block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted"
              >
                {pin.thumbnailUrl ? (
                  <img
                    src={pin.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-background text-4xl">
                    {category?.emoji ?? "📍"}
                  </div>
                )}

                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/thumb:bg-black/40">
                  <span className="flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                    <Play className="size-4 fill-foreground" />
                  </span>
                </span>

                <span className="absolute left-2 top-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                  {platformLabel[pin.sourcePlatform]}
                </span>
              </button>
            )}
            <div className="flex items-start justify-between gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-lg transition-colors hover:border-foreground/30">
                    {category?.emoji ?? "📍"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1" align="start">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(pin.id, c.id)}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <span>{c.emoji}</span>
                      <span className="text-foreground">{c.name}</span>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-0.5 md:opacity-0 md:transition-opacity md:focus-within:opacity-100 md:group-hover:opacity-100">
                {pin.sourceUrl && (
                  <Button variant="ghost" size="icon" className="size-7 cursor-pointer" asChild>
                    <a href={pin.sourceUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="size-7 cursor-pointer" onClick={() => openInMaps(pin)}>
                  <Navigation className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7 cursor-pointer" onClick={() => openEdit(pin)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 cursor-pointer text-destructive hover:text-destructive"
                  onClick={() => setDeleteTargetId(pin.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <h3 className="mt-3 text-sm font-medium tracking-tight text-foreground">{pin.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {category?.name ?? "Uncategorized"} · {pin.country}
              {!isDone && ` · ${pin.distanceKm}km away`}
            </p>

            {isDone && pin.rating && (
              <div className="mt-2 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3 ${i < pin.rating! ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            )}

            {pin.note && <p className="mt-2 text-xs text-muted-foreground">"{pin.note}"</p>}

            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <span className="mt-3 text-[11px] text-muted-foreground/70">
                Pinned {formatPinnedDate(pin.pinnedAt)}
              </span>
              <button
                onClick={() => handleToggleClick(pin)}
                className={`mt-3 flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  isDone
                    ? "bg-primary/15 text-primary hover:bg-primary/25"
                    : "border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                <Check className="size-3.5" />
                {isDone ? "Done" : "Mark done"}
              </button>
            </div>
          </div>
        )
      })}

      {filteredPins.length === 0 && (
        <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
          No pins match these filters.
        </p>
      )}

      <Dialog open={!!editingPin} onOpenChange={(open) => !open && setEditingPin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit pin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="pin-name">Name</Label>
              <Input id="pin-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin-note">Note</Label>
              <Textarea id="pin-note" value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="What made this place worth saving?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" className="cursor-pointer" onClick={() => setEditingPin(null)}>Cancel</Button>
            <Button className="cursor-pointer" onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete this pin?"
        description="This can't be undone. The pin and any notes or photos on it will be gone for good."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!confirmCompleteId}
        onOpenChange={(open) => !open && setConfirmCompleteId(null)}
        title="Mark as done?"
        description={`Mark "${pinBeingCompleted?.name}" as visited. You'll get a chance to leave a quick review after.`}
        confirmLabel="Mark done"
        onConfirm={handleConfirmComplete}
      />

      <ReviewModal
        open={!!reviewTargetId}
        onOpenChange={(open) => !open && setReviewTargetId(null)}
        title={`How was ${pinBeingReviewed?.name ?? "it"}?`}
        description="Rate it and jot a quick note — handy if you want to recommend it later."
        onSubmit={handleReviewSubmit}
      />

      {videoPin?.sourceUrl && videoPin.sourcePlatform && (
        <VideoModal
          open={!!videoPinId}
          onOpenChange={(open) => !open && setVideoPinId(null)}
          title={videoPin.name}
          platform={videoPin.sourcePlatform}
          url={videoPin.sourceUrl}
        />
      )}
    </div>
  )
}