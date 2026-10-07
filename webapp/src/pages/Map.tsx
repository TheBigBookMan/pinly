import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import PinsFilters, { type FilterMode, type FilterState } from "@/components/features/Pins/PinsFilter"
import CategoryFilterChips from "@/components/features/Pins/CategoryFilterChips"
import PinsMap from "@/components/features/Map/PinsMap"
import { dummyCategories, dummyPins } from "@/data/pins"
import { filterPins } from "@/utils/pins"
import { type PinEditChanges } from "@/components/shared/EditPinDialog"

const Map = () => {
  const categories = dummyCategories
  const [pins, setPins] = useState(dummyPins)

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    distanceKm: 50,
    countries: [],
  })
  const [filterMode, setFilterMode] = useState<FilterMode>(null)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleEditPin = (id: string, changes: PinEditChanges) =>
  setPins((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)))

  const toggleCategory = (id: string) =>
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  const visiblePins = useMemo(
    () => filterPins(pins, filters, filterMode, selectedCategoryIds),
    [pins, filters, filterMode, selectedCategoryIds]
  )

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) +
    (filterMode === "distance" ? 1 : 0) +
    (filterMode === "countries" && filters.countries.length > 0 ? 1 : 0) +
    (selectedCategoryIds.length > 0 ? 1 : 0)

  return (
    <div className="flex flex-1 flex-col">
      {/* Desktop: filters across the top */}
      <div className="hidden flex-col gap-3 border-b border-border/60 bg-background/70 px-6 py-3 backdrop-blur-xl md:flex">
        <CategoryFilterChips
          categories={categories}
          selectedIds={selectedCategoryIds}
          onToggle={toggleCategory}
          className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent hover:scrollbar-thumb-accent"
        />
        <PinsFilters
          filters={filters}
          onFiltersChange={setFilters}
          filterMode={filterMode}
          onFilterModeChange={setFilterMode}
        />
      </div>

      {/* `isolate` keeps Leaflet's high internal z-indexes from covering the navbar, sheets and dialogs */}
      <div className="relative isolate min-h-[420px] flex-1">
        <PinsMap pins={visiblePins} categories={categories} onEditPin={handleEditPin} />

        {/* Mobile: filters in a side sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-3 top-3 z-[1000] shadow-lg md:hidden"
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader className="border-b border-border">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="sr-only">Filter the pins shown on the map</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 py-2">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Categories</div>
                <CategoryFilterChips
                  categories={categories}
                  selectedIds={selectedCategoryIds}
                  onToggle={toggleCategory}
                  className="flex flex-wrap gap-2"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Filter by</div>
                <PinsFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  filterMode={filterMode}
                  onFilterModeChange={setFilterMode}
                  className="flex-col items-start"
                />
              </div>

              <Button onClick={() => setSheetOpen(false)}>
                Show {visiblePins.length} {visiblePins.length === 1 ? "pin" : "pins"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Map