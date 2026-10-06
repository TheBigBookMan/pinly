import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import { getEmbedUrl, type SourcePlatform } from "@/utils/embed"

type VideoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  platform: SourcePlatform
  url: string
}

export default function VideoModal({ open, onOpenChange, title, platform, url }: VideoModalProps) {
  const embedUrl = open ? getEmbedUrl(platform, url) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{title}</DialogTitle>
          <DialogDescription className="sr-only">Video preview</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <div className="aspect-[9/16] h-[min(70vh,560px)] overflow-hidden rounded-lg bg-black">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="size-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex size-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                Couldn't build a player for this link. Open the original instead.
              </div>
            )}
          </div>
        </div>

        <Button variant="secondary" asChild>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            Open original
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  )
}