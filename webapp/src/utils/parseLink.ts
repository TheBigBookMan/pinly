import type { SourcePlatform } from "@/utils/embed"

export type ParsedLink = {
  platform: SourcePlatform
  url: string
  thumbnailUrl?: string
  caption?: string
  candidate?: { name: string; lat: number; lng: number; country: string }
}

// Only https links from the supported platforms get through. The server has to repeat this check.
export const detectPlatform = (raw: string): SourcePlatform | null => {
  try {
    const u = new URL(raw.trim())
    if (u.protocol !== "https:") return null
    const host = u.hostname.replace(/^www\./, "")
    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return "tiktok"
    if (host === "instagram.com") return "instagram"
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") return "youtube"
  } catch {
    // not a valid URL
  }
  return null
}

const sampleCandidates = [
  { name: "Sunset Rooftop Bar", lat: 18.7883, lng: 98.9853, country: "Thailand" },
  { name: "Doi Inthanon Summit", lat: 18.5895, lng: 98.4867, country: "Thailand" },
  { name: "Bun Cha Huong Lien", lat: 21.0173, lng: 105.8567, country: "Vietnam" },
  { name: "Livraria Lello", lat: 41.1469, lng: -8.6149, country: "Portugal" },
]

// Fake. The real version becomes POST /links/parse, handled by the FastAPI service.
// Test triggers: a URL containing "nolocation" finds no place, one containing "fail" throws.
export const parseLink = async (rawUrl: string): Promise<ParsedLink> => {
  const platform = detectPlatform(rawUrl)
  if (!platform) throw new Error("Paste a TikTok, Instagram or YouTube Shorts link.")

  await new Promise((resolve) => setTimeout(resolve, 900))

  if (rawUrl.includes("fail")) {
    throw new Error("Couldn't read that link. Try again, or add the pin without it.")
  }

  const hash = [...rawUrl].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
  const base = {
    platform,
    url: rawUrl.trim(),
    thumbnailUrl: `https://picsum.photos/seed/${hash}/600/450`,
  }

  if (rawUrl.includes("nolocation")) return { ...base, caption: "best day ever 🌴" }

  return { ...base, caption: "Found this on my feed", candidate: sampleCandidates[hash % sampleCandidates.length] }
}