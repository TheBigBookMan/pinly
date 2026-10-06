import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Category } from "@/types/category"
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

type EditCategoriesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSave: (categories: Category[]) => void
}

const EditCategoriesDialog = ({ open, onOpenChange, categories, onSave }: EditCategoriesDialogProps) => {
  const [draft, setDraft] = useState<Category[]>(categories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(categories)
      setShowForm(false)
      setEditingId(null)
    }
    onOpenChange(next)
  }

  const openAddForm = () => {
    setEditingId(null)
    setName("")
    setEmoji("")
    setShowForm(true)
  }

  const openEditForm = (category: Category) => {
    setEditingId(category.id)
    setName(category.name)
    setEmoji(category.emoji)
    setShowForm(true)
  }

  const handleFormSave = () => {
    if (!name.trim()) return

    if (editingId) {
      setDraft((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name, emoji } : c))
      )
    } else {
      setDraft((prev) => [...prev, { id: crypto.randomUUID(), name, emoji: emoji || "📍" }])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setDraft((prev) => prev.filter((c) => c.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setDraft((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  const moveDown = (index: number) => {
    setDraft((prev) => {
      if (index === prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  const handleSave = () => {
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit categories</DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-emoji">Emoji</Label>
              <Input
                id="category-emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🍺"
                maxLength={2}
                className="w-20 text-center text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Barssss"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleFormSave}>
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 py-2">
              {draft.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="text-muted-foreground disabled:opacity-20"
                      >
                        <ChevronUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === draft.length - 1}
                        className="text-muted-foreground disabled:opacity-20"
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-lg">{category.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => openEditForm(category)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="ghost" className="mt-2 justify-start" onClick={openAddForm}>
                <Plus className="size-4" />
                Add category
              </Button>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditCategoriesDialog;