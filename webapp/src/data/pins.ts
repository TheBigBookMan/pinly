import type { Pin } from "@/types/pins"
import type { Category } from "@/types/category"

export const dummyCategories: Category[] = [
  { id: "1", name: "Barssss", emoji: "🍺" },
  { id: "2", name: "Hiking", emoji: "🥾" },
  { id: "3", name: "Viewpoint", emoji: "🌄" },
  { id: "4", name: "Food", emoji: "🍜" },
  { id: "5", name: "Beach", emoji: "🏖️" },
]

export const dummyPins: Pin[] = [
  { id: "1", name: "Sunset Rooftop", categoryId: "1", country: "Thailand", distanceKm: 3, lat: 18.7883, lng: 98.9853, status: "want_to_see", sourceUrl: "https://www.tiktok.com/@example/video/7000000000000000000", sourcePlatform: "tiktok", thumbnailUrl: "https://picsum.photos/seed/rooftop/600/450", pinnedAt: "2026-09-12" },
  { id: "2", name: "Nong Khiaw Viewpoint", categoryId: "3", country: "Laos", distanceKm: 420, lat: 20.5667, lng: 102.6167, status: "done", rating: 5, note: "Best sunrise of the whole trip.", pinnedAt: "2026-08-02" },
  { id: "3", name: "Doi Suthep Trail", categoryId: "2", country: "Thailand", distanceKm: 12, lat: 18.8048, lng: 98.9217, status: "want_to_see", sourceUrl: "https://www.instagram.com/reel/EXAMPLE123/", sourcePlatform: "instagram", pinnedAt: "2026-09-20" },
  { id: "4", name: "Pasteis de Belem", categoryId: "4", country: "Portugal", distanceKm: 9500, lat: 38.6975, lng: -9.2033, status: "done", rating: 4, pinnedAt: "2026-07-15" },
  { id: "5", name: "Warorot Market", categoryId: "4", country: "Thailand", distanceKm: 5, lat: 18.7917, lng: 99.0004, status: "want_to_see", sourceUrl: "https://www.youtube.com/shorts/abc123EXAMPLE", sourcePlatform: "youtube", thumbnailUrl: "https://picsum.photos/seed/market/600/450", pinnedAt: "2026-09-25" },
]