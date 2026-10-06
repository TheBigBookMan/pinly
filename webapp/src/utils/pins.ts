import type { Pin } from "@/types/pins"
import type { FilterMode, FilterState } from "@/components/features/Pins/PinsFilters"

export const filterPins = (
  pins: Pin[],
  filters: FilterState,
  filterMode: FilterMode,
  selectedCategoryIds: string[]
) =>
  pins.filter((pin) => {
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

export const formatPinnedDate = (iso: string) => {
  const date = new Date(iso)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`
}

export const openInMaps = (pin: Pin) => {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`,
    "_blank",
    "noopener,noreferrer"
  )
}