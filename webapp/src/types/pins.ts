import type { SourcePlatform } from "@/utils/embed"

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
  sourcePlatform?: SourcePlatform
  thumbnailUrl?: string
  rating?: number
  note?: string
  pinnedAt: string
}