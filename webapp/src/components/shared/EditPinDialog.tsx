import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Pin } from "@/types/pins"
import type { Category } from "@/types/category"

export type PinEditChanges = { name: string; categoryId: string; note?: string }

type EditPinDialogProps = {
  pin: Pin | null
  categories: Category[]
  onClose: () => void
  onSave: (id: string, changes: PinEditChanges) => void
}

function EditPinForm({
  pin,
  categories,
  onClose,
  onSave,
}: { pin: Pin } & Omit<EditPinDialogProps, "pin">) {
  const [name, setName] = useState(pin.name)
  const [note, setNote] = useState(pin.note ?? "")
  // A pin whose category was deleted starts with nothing selected.
  const [categoryId, setCategoryId] = useState(
    categories.some((c) => c.id === pin.categoryId) ? pin.categoryId : ""
  )

  const canSave = name.trim() !== "" && categoryId !== ""

  const handleSave = () => {
    if (!canSave) return
    onSave(pin.id, { name: name.trim(), categoryId, note: note.trim() || undefined })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit pin</DialogTitle>
        <DialogDescription className="sr-only">
          Change this pin's name, category and note
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="edit-pin-name">Name</Label>
          <Input id="edit-pin-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-pin-category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="edit-pin-category" className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-pin-note">Note</Label>
          <Textarea
            id="edit-pin-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What made this place worth saving?"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!canSave}>
          Save
        </Button>
      </DialogFooter>
    </>
  )
}

export default function EditPinDialog({ pin, categories, onClose, onSave }: EditPinDialogProps) {
  return (
    <Dialog open={!!pin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {/* key resets the form's fields whenever a different pin is opened */}
        {pin && (
          <EditPinForm key={pin.id} pin={pin} categories={categories} onClose={onClose} onSave={onSave} />
        )}
      </DialogContent>
    </Dialog>
  )
}