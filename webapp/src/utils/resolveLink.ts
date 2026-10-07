import { detectLinkKind, parseMapInput, type NoMatchReason } from "@/utils/mapLinks"

export type PlaceCandidate = {
  id: string
  name: string
  region: string
  country: string
  lat: number
  lng: number
}

export type ResolveResult =
  | { status: "no_match"; reason?: NoMatchReason }
  | { status: "multiple"; candidates: PlaceCandidate[] }
  | { status: "success"; place: PlaceCandidate }
  | { status: "duplicate"; pinName: string }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const sunsetCandidates: PlaceCandidate[] = [
  { id: "c1", name: "Sunset Rooftop Bar", region: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853 },
  { id: "c2", name: "Sunset Rooftop Lounge", region: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { id: "c3", name: "Sunset Sky Bar", region: "Pattaya", country: "Thailand", lat: 12.9236, lng: 100.8825 },
]

// Fake. The real version is a backend call that follows the redirects of an allow-listed short link
// (https only, a few hops, host re-checked on each hop) and returns the full URL.
// Test trigger: "broken" in the URL makes the expansion fail.
const fakeExpandShortLink = async (url: string): Promise<string | null> => {
  await sleep(1500)
  if (url.includes("broken")) return null
  return "https://www.google.com/maps/place/Angkor+Wat/@13.4124693,103.8667,17z/data=!3m1!4b1!8m2!3d13.4124693!4d103.8669857"
}

const resolveMapLink = async (input: string): Promise<ResolveResult> => {
  await sleep(600)

  let parsed = parseMapInput(input)

  if (parsed?.status === "needs_expansion") {
    const expanded = await fakeExpandShortLink(input)
    parsed = expanded ? parseMapInput(expanded) : { status: "unreadable", reason: "expand_failed" }
  }

  if (parsed?.status === "resolved") {
    await sleep(1200) // stands in for the backend's reverse-geocoding call
    const { place } = parsed
    return {
      status: "success",
      place: {
        id: crypto.randomUUID(),
        name: place.name ?? "Dropped pin",
        region: "", // filled in by reverse geocoding once the backend exists
        country: "",
        lat: place.lat,
        lng: place.lng,
      },
    }
  }

  return {
    status: "no_match",
    reason: parsed?.status === "unreadable" ? parsed.reason : "expand_failed",
  }
}

// Fake. The real version becomes a call to your API.
// Video link test triggers: "nomatch" gives response 1, "multiple" gives response 2, anything else gives response 3.
export const resolveLink = async (input: string): Promise<ResolveResult> => {
  if (input.includes("duplicate")) {
    await sleep(1500)
    return { status: "duplicate", pinName: "Sunset Rooftop" }
  }

  if (detectLinkKind(input) === "map") return resolveMapLink(input)

  await sleep(2800)

  if (input.includes("nomatch")) return { status: "no_match" }
  if (input.includes("multiple")) return { status: "multiple", candidates: sunsetCandidates }
  return { status: "success", place: sunsetCandidates[0] }
}