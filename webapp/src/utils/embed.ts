export type SourcePlatform = "tiktok" | "instagram" | "youtube"

export const platformLabel: Record<SourcePlatform, string> = {
  tiktok: "TikTok",
  instagram: "Reel",
  youtube: "Short",
}

export const getEmbedUrl = (platform: SourcePlatform, url: string): string | null => {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)

    if (platform === "youtube") {
      const id = u.hostname.includes("youtu.be")
        ? parts[0]
        : parts[0] === "shorts"
          ? parts[1]
          : u.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (platform === "tiktok") {
      const match = u.pathname.match(/\/video\/(\d+)/)
      return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null
    }

    if (platform === "instagram") {
      const match = u.pathname.match(/\/(reel|p|tv)\/([^/]+)/)
      return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed` : null
    }
  } catch {
    return null
  }
  return null
}