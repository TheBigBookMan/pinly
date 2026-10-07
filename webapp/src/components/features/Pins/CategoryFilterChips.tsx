import type { Category } from "@/types/category"

type CategoryFilterChipsProps = {
  categories: Category[]
  selectedIds: string[]
  onToggle: (id: string) => void
  className?: string
}

export default function CategoryFilterChips({ categories, selectedIds, onToggle, className }: CategoryFilterChipsProps) {
  return (
    <div className={className}>
      {categories.map((category) => {
        const isSelected = selectedIds.includes(category.id)
        return (
          <button
            key={category.id}
            onClick={() => onToggle(category.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary/40 text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-base">{category.emoji}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}