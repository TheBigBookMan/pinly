import { useCallback, useEffect, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "@/styles/leaflet-overrides.css"
import { LocateFixed, Navigation, Play, Star } from "lucide-react"
import VideoModal from "@/components/shared/VideoModal"
import { platformLabel } from "@/utils/embed"
import { formatPinnedDate, openInMaps } from "@/utils/pins"
import type { Pin } from "@/types/pins"
import type { Category } from "@/types/category"

// Category emojis are user-entered, and they end up in an HTML string below, so escape them.
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!
  )

// Cached so Leaflet isn't handed a new icon object on every render.
const iconCache = new Map<string, L.DivIcon>()
const pinIcon = (emoji: string, done: boolean) => {
  const key = `${emoji}|${done}`
  let icon = iconCache.get(key)
  if (!icon) {
    icon = L.divIcon({
      className: "",
      html: `<div class="pin-enter flex size-9 items-center justify-center rounded-full border-2 text-base shadow-lg shadow-black/40 transition-transform hover:scale-110 ${
        done ? "border-primary bg-primary/90" : "border-border bg-card"
      }">${escapeHtml(emoji)}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    })
    iconCache.set(key, icon)
  }
  return icon
}

const userIcon = L.divIcon({
  className: "",
  html: `<span class="relative flex size-4"><span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60"></span><span class="relative inline-flex size-4 rounded-full border-2 border-background bg-primary"></span></span>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

type GeoStatus = "loading" | "ready" | "denied"

function MapController({
  userPos,
  pins,
  geoStatus,
}: {
  userPos: [number, number] | null
  pins: Pin[]
  geoStatus: GeoStatus
}) {
  const map = useMap()

  useEffect(() => {
    if (userPos) map.flyTo(userPos, 13, { duration: 1.2 })
  }, [userPos, map])

  useEffect(() => {
    if (geoStatus === "denied" && pins.length > 0) {
      map.fitBounds(
        L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])),
        { padding: [48, 48], maxZoom: 12 }
      )
    }
    // Only when location is denied, not on every filter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoStatus, map])

  return null
}

function PinPopup({ pin, category, onPlay }: { pin: Pin; category?: Category; onPlay: () => void }) {
  const isDone = pin.status === "done"

  // Divs and buttons only: Leaflet's own CSS overrides <p> margins and <a> colors inside the map.
  return (
    <div className="w-60">
      {pin.sourceUrl && pin.sourcePlatform && (
        <button
          onClick={onPlay}
          className="group/thumb relative block aspect-video w-full overflow-hidden bg-muted"
        >
          {pin.thumbnailUrl ? (
            <img
              src={pin.thumbnailUrl}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-background text-4xl">
              {category?.emoji ?? "📍"}
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/thumb:bg-black/40">
            <span className="flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
              <Play className="size-4 fill-foreground" />
            </span>
          </span>
          <span className="absolute bottom-2 left-2 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
            {platformLabel[pin.sourcePlatform]}
          </span>
        </button>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-foreground">
              {category?.emoji} {pin.name}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {category?.name ?? "Uncategorized"} · {pin.country}
            </div>
          </div>
          <span
            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
              isDone ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {isDone ? "Done" : "Want to see"}
          </span>
        </div>

        {isDone && pin.rating && (
          <div className="mt-2 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < pin.rating! ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
        )}

        {pin.note && <div className="mt-2 text-xs text-muted-foreground">"{pin.note}"</div>}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
          <span className="text-[11px] text-muted-foreground/70">
            Pinned {formatPinnedDate(pin.pinnedAt)}
          </span>
          <button
            onClick={() => openInMaps(pin)}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Navigation className="size-3.5" />
            Directions
          </button>
        </div>
      </div>
    </div>
  )
}

type PinsMapProps = {
  pins: Pin[]
  categories: Category[]
}

export default function PinsMap({ pins, categories }: PinsMapProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("loading")
  const [videoPinId, setVideoPinId] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("denied")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude])
        setGeoStatus("ready")
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  const handlePlay = (pin: Pin) => {
    if (!pin.sourceUrl) return
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.open(pin.sourceUrl, "_blank", "noopener,noreferrer")
    } else {
      setVideoPinId(pin.id)
    }
  }

  const videoPin = pins.find((p) => p.id === videoPinId)

  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        zoomControl={false}
        className="absolute inset-0 z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_KEY}`}
          subdomains="abcd"
          maxZoom={20}
        />
        <ZoomControl position="topright" />
        <MapController userPos={userPos} pins={pins} geoStatus={geoStatus} />

        {userPos && (
          <Marker position={userPos} icon={userIcon} interactive={false} keyboard={false} zIndexOffset={-100} />
        )}

        {pins.map((pin) => {
          const category = categories.find((c) => c.id === pin.categoryId)
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pinIcon(category?.emoji ?? "📍", pin.status === "done")}
            >
              <Popup minWidth={240} maxWidth={240}>
                <PinPopup pin={pin} category={category} onPlay={() => handlePlay(pin)} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <button
        type="button"
        onClick={requestLocation}
        aria-label="Center on my location"
        className={`absolute right-[10px] top-[5.5rem] z-[1000] flex size-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted ${
          geoStatus === "loading" ? "animate-pulse" : ""
        }`}
      >
        <LocateFixed className="size-4" />
      </button>

      {pins.length === 0 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground shadow-lg">
          No pins match these filters
        </div>
      )}

      {videoPin?.sourceUrl && videoPin.sourcePlatform && (
        <VideoModal
          open={!!videoPinId}
          onOpenChange={(open) => !open && setVideoPinId(null)}
          title={videoPin.name}
          platform={videoPin.sourcePlatform}
          url={videoPin.sourceUrl}
        />
      )}
    </>
  )
}