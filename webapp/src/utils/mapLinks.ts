import { detectPlatform } from "@/utils/parseLink"

export type MapPlace = { lat: number; lng: number; name?: string }

export type NoMatchReason = "apple_short" | "map_no_coordinates" | "expand_failed"

export type MapParseResult =
  | { status: "resolved"; place: MapPlace }
  | { status: "needs_expansion" }
  | { status: "unreadable"; reason: NoMatchReason }

export type LinkKind = "video" | "map"

const NUMBER = "-?\\d+(?:\\.\\d+)?"
const PAIR_IN_PARAM = new RegExp(`^\\s*(${NUMBER})\\s*,\\s*(${NUMBER})\\s*$`)
// Pasted coordinates need decimals, so two stray numbers don't turn into a pin.
const RAW_COORDS = /^\s*(-?\d{1,3}\.\d+)\s*[,;]\s*(-?\d{1,3}\.\d+)\s*$/

const isValid = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180

const toPlace = (lat: string, lng: string, name?: string): MapPlace | null => {
  const la = Number(lat)
  const ln = Number(lng)
  return isValid(la, ln) ? { lat: la, lng: ln, name } : null
}

export const parseCoordinates = (text: string): MapPlace | null => {
  const match = RAW_COORDS.exec(text)
  return match ? toPlace(match[1], match[2]) : null
}

const coordsFromParam = (value: string | null, name?: string): MapPlace | null => {
  const match = value ? PAIR_IN_PARAM.exec(value) : null
  return match ? toPlace(match[1], match[2], name) : null
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

// Names come out of a URL, so treat them as untrusted text: cap the length and skip coordinate-style names.
const cleanName = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined
  const name = safeDecode(value).trim()
  if (!name || name.startsWith("@") || name.includes("°") || parseCoordinates(name)) return undefined
  return name.slice(0, 120)
}

const toHttpsUrl = (raw: string): URL | null => {
  try {
    const url = new URL(raw.trim())
    return url.protocol === "https:" ? url : null
  } catch {
    return null
  }
}

type MapProvider = "google" | "google_short" | "apple" | "apple_short"

// Host allow-list. The server has to repeat this check, because the client's copy is only for UX.
const classify = (url: URL): MapProvider | null => {
  const host = url.hostname.toLowerCase()
  if (host === "maps.google.com") return "google"
  if ((host === "google.com" || host === "www.google.com") && url.pathname.startsWith("/maps")) return "google"
  if (host === "maps.app.goo.gl" || (host === "goo.gl" && url.pathname.startsWith("/maps"))) return "google_short"
  if (host === "maps.apple.com") return "apple"
  if (host === "maps.apple" && url.pathname.startsWith("/p/")) return "apple_short"
  return null
}

const parseGoogle = (url: URL): MapParseResult => {
  const path = url.pathname
  const segments = path.split("/").filter(Boolean)
  const placeIndex = segments.indexOf("place")
  const name = placeIndex >= 0 ? cleanName(segments[placeIndex + 1]) : undefined

  // The exact pin (!3d…!4d…) beats the viewport centre (@lat,lng), which is only where the map was looking.
  const match =
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(path + url.search) ??
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(path)

  const place =
    (match && toPlace(match[1], match[2], name)) ||
    coordsFromParam(
      url.searchParams.get("q") ?? url.searchParams.get("query") ?? url.searchParams.get("ll"),
      name
    )

  return place
    ? { status: "resolved", place }
    : { status: "unreadable", reason: "map_no_coordinates" }
}

const parseApple = (url: URL): MapParseResult => {
  const params = url.searchParams
  const name = cleanName(params.get("name") ?? params.get("q"))
  const place = coordsFromParam(params.get("ll") ?? params.get("coordinate"), name)

  return place
    ? { status: "resolved", place }
    : { status: "unreadable", reason: "map_no_coordinates" }
}

// Returns null when the input isn't a map link or coordinates at all.
export const parseMapInput = (raw: string): MapParseResult | null => {
  const coords = parseCoordinates(raw)
  if (coords) return { status: "resolved", place: coords }

  const url = toHttpsUrl(raw)
  if (!url) return null

  switch (classify(url)) {
    case "google":
      return parseGoogle(url)
    case "google_short":
      return { status: "needs_expansion" }
    case "apple":
      return parseApple(url)
    case "apple_short":
      return { status: "unreadable", reason: "apple_short" }
    default:
      return null
  }
}

export const detectLinkKind = (raw: string): LinkKind | null => {
  if (detectPlatform(raw)) return "video"
  if (parseMapInput(raw)) return "map"
  return null
}