import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { MapPin, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type FilterMode = "distance" | "countries" | null

export type FilterState = {
  status: "all" | "completed" | "not_completed"
  distanceKm: number
  countries: string[]
}

type PinsFiltersProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  filterMode: FilterMode
  onFilterModeChange: (mode: FilterMode) => void
  className?: string
}

// Dummy — would come from the backend, derived from which countries the user has pins in
const availableCountries = ["Thailand", "Vietnam", "Portugal", "Germany", "Spain", "Laos"]

export default function PinsFilters({ filters, onFiltersChange, filterMode, onFilterModeChange, className }: PinsFiltersProps) {
  const [distanceDialogOpen, setDistanceDialogOpen] = useState(false)
  const [countryDialogOpen, setCountryDialogOpen] = useState(false)
  const [draftDistance, setDraftDistance] = useState(filters.distanceKm)

  const selectMode = (mode: FilterMode) => {
    if (mode === "distance") {
      onFiltersChange({ ...filters, countries: [] })
    } else if (mode === "countries") {
      onFiltersChange({ ...filters, distanceKm: 50 })
    }
    onFilterModeChange(mode)
  }

  const toggleCountry = (country: string) => {
    onFiltersChange({
      ...filters,
      countries: filters.countries.includes(country)
        ? filters.countries.filter((c) => c !== country)
        : [...filters.countries, country],
    })
  }

  const handleDistanceOpen = () => {
    setDraftDistance(filters.distanceKm)
    setDistanceDialogOpen(true)
  }

  const handleDistanceSave = () => {
    onFiltersChange({ ...filters, distanceKm: draftDistance })
    setDistanceDialogOpen(false)
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select
        value={filters.status}
        onValueChange={(value: FilterState["status"]) =>
          onFiltersChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-40 rounded-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All pins</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="not_completed">Not completed</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
        <button
          onClick={() => selectMode(filterMode === "distance" ? null : "distance")}
          className={`rounded-full cursor-pointer px-3 py-1 text-xs font-medium transition-colors ${
            filterMode === "distance"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Distance
        </button>
        <button
          onClick={() => selectMode(filterMode === "countries" ? null : "countries")}
          className={`rounded-full cursor-pointer px-3 py-1 text-xs font-medium transition-colors ${
            filterMode === "countries"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Countries
        </button>
      </div>

      {filterMode === "distance" && (
        <Button variant="secondary" size="sm" className="rounded-full" onClick={handleDistanceOpen}>
          <MapPin className="size-4" />
          Within {filters.distanceKm}km
        </Button>
      )}

      {filterMode === "countries" && (
        <>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={() => setCountryDialogOpen(true)}
          >
            Countries
            {filters.countries.length > 0 && (
              <span className="ml-1 rounded-full bg-accent px-1.5 text-xs text-accent-foreground">
                {filters.countries.length}
              </span>
            )}
          </Button>
          {filters.countries.map((country) => (
            <button
              key={country}
              onClick={() => toggleCountry(country)}
              className="flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              {country}
              <X className="size-3" />
            </button>
          ))}
        </>
      )}

      <Dialog open={distanceDialogOpen} onOpenChange={setDistanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distance from you</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-center text-2xl font-semibold text-foreground">
              {draftDistance}km
            </p>
            <Slider
              value={[draftDistance]}
              onValueChange={([value]) => setDraftDistance(value)}
              min={1}
              max={500}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1km</span>
              <span>500km</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDistanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDistanceSave}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={countryDialogOpen} onOpenChange={setCountryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter by country</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1 py-2">
            {availableCountries.map((country) => {
              const selected = filters.countries.includes(country)
              return (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="text-foreground">{country}</span>
                  {selected && <Check className="size-4 text-accent" />}
                </button>
              )
            })}
          </div>

          <DialogFooter>
            <Button onClick={() => setCountryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}