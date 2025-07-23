"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { VideoNote } from "@/types/entities";

interface VideoCardProps {
  video: VideoNote;
  onDelete: () => void;
  onClick: () => void;
}

export default function VideoCard({ video, onDelete, onClick }: VideoCardProps) {
  return (
    <Card className="overflow-hidden relative group">
      <img
        src={video.thumbnail ?? "https://via.placeholder.com/320x180?text=No+Thumbnail"}
        alt={video.title ?? "YouTube Video"}
        className="w-full h-40 object-cover cursor-pointer"
        onClick={onClick}
      />
      <CardContent className="p-2 flex flex-col gap-1">
        <p className="text-sm font-medium truncate">{video.title ?? "Untitled Video"}</p>
        <div className="flex justify-between">
          <Button size="sm" onClick={onClick}>Watch</Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
