"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VideoNote } from "@/types/entities";

interface VideoCardProps {
  video: VideoNote;
}

export default function VideoCard({ video }: VideoCardProps) {
  // Color map for badge clarity
  const typeColors: Record<VideoNote["type"], string> = {
    mtp: "bg-blue-100 text-blue-800",
    rtp: "bg-green-100 text-green-800",
    revision: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer">
      <CardContent className="p-0">
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title ?? "Video Thumbnail"}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium line-clamp-2">{video.title ?? "Untitled Video"}</h3>
            <Badge
              className={`text-xs px-2 py-0.5 rounded ${typeColors[video.type]}`}
            >
              {video.type.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground break-all">
            {video.url}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
