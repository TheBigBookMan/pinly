import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"

type ReviewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  initialRating?: number
  initialNote?: string
  onSubmit: (rating: number, note: string) => void
}

export default function ReviewModal({
  open,
  onOpenChange,
  title = "How was it?",
  description = "Leave a quick rating and note for later.",
  initialRating = 0,
  initialNote = "",
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [note, setNote] = useState(initialNote)

  useEffect(() => {
    if (open) {
      setRating(initialRating)
      setNote(initialNote)
      setHoverRating(0)
    }
  }, [open, initialRating, initialNote])

  const handleSubmit = () => {
    onSubmit(rating, note)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1
              const filled = starValue <= (hoverRating || rating)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer p-1"
                >
                  <Star
                    className={`size-7 transition-colors ${
                      filled ? "fill-accent text-accent" : "text-muted-foreground"
                    }`}
                  />
                </button>
              )
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-note">Note</Label>
            <Textarea
              id="review-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What made this place worth it?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="cursor-pointer" onClick={() => onOpenChange(false)}>
            Skip
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit} disabled={rating === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}