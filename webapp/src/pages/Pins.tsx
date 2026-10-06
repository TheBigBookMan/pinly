/*
This page is where the user can see pins in a list format.
User can manage the pin categories create, update, delete.
user can copy link into here as well.
view the reels in here as well
*/

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Pencil, ChevronDown as ChevronDownIcon } from "lucide-react"
import EditCategoriesDialog from "@/components/features/Pins/EditCategoriesDialog"
import type { Category } from "@/types/category"
import PinsFilters, { type FilterMode, type FilterState } from "@/components/features/Pins/PinsFilter"
import PinsList from "@/components/features/Pins/PinsList"

const dummyCategories: Category[] = [
  { id: "1", name: "Barssss", emoji: "🍺" },
  { id: "2", name: "Hiking", emoji: "🥾" },
  { id: "3", name: "Viewpoint", emoji: "🌄" },
  { id: "4", name: "Food", emoji: "🍜" },
  { id: "5", name: "Beach", emoji: "🏖️" },
]

const Pins = () => {
  const [categories, setCategories] = useState<Category[]>(dummyCategories)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    distanceKm: 50,
    countries: [],
  })
  const [filterMode, setFilterMode] = useState<FilterMode>(null)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="mx-auto w-full px-6 py-4">
      <h1 className="text-2xl font-semibold text-foreground">Pins</h1>

      <div className="mt-6 flex items-center gap-3">
        {/* Desktop: dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="hidden rounded-full md:flex cursor-pointer">
              Categories
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              <Pencil className="size-4" />
              Edit categories
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile: direct icon button */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => setDialogOpen(true)}
        >
          <Pencil className="size-4" />
        </Button>

        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent hover:scrollbar-thumb-accent">
          {categories.map((category: Category) => (
            <div
              onClick={() => toggleCategoryFilter(category.id)}
              key={category.id}
              className={`flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 cursor-pointer transition ${selectedCategoryIds.includes(category.id) ? 'bg-accent' : 'bg-secondary/40 hover:bg-accent '}`}
            >
              <span className="text-base">{category.emoji}</span>
              <span className="text-sm font-medium text-foreground">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      <EditCategoriesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        onSave={setCategories}
      />

      <PinsFilters
        filters={filters}
        onFiltersChange={setFilters}
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
      />

      <PinsList
        categories={categories}
        filters={filters}
        filterMode={filterMode}
        selectedCategoryIds={selectedCategoryIds}
      />
    </div>
  )
}

export default Pins