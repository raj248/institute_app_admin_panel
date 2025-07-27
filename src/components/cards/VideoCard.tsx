"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VideoNote } from "@/types/entities";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  addNewlyAddedItem,
  moveVideoNoteToTrash,
  removeNewlyAddedItem,
} from "@/lib/api";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface VideoCardProps {
  video: VideoNote;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function VideoCard({ video, onDelete, onClick }: VideoCardProps) {
  const typeColors: Record<VideoNote["type"], string> = {
    mtp: "bg-blue-100 text-blue-800",
    rtp: "bg-green-100 text-green-800",
    revision: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  const [loading, setLoading] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(video.newlyAddedId);
  const confirm = useConfirm();

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Video Note?",
      description: "This will move the video note to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const res = await moveVideoNoteToTrash(id);
    if (!res.success) {
      console.error("Failed to move video note to trash.");
      toast.error("Failed to move video note to trash.");
      return;
    }

    onDelete?.();
  };

  const handleViewVideo = (video: VideoNote) => {
    window.open(video.url, "_blank");
  };

  const toggleNewlyAdded = async () => {
    setLoading(true);
    try {
      if (!newlyAddedId) {
        const res = await addNewlyAddedItem("VideoNote", video.id);
        if (res.success && res.data) {
          setNewlyAddedId(res.data.id);
          toast.success("Marked as newly added");
        }
      } else {
        const res = await removeNewlyAddedItem(newlyAddedId);
        if (res.success) {
          setNewlyAddedId(null);
          toast.success("Unmarked as newly added");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle newly added");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="
        relative group
        hover:scale-[1.02]
        rounded-xl overflow-hidden shadow-sm
        hover:shadow-md hover:shadow-primary/40
        transition-transform duration-150 cursor-pointer
        bg-background hover:bg-accent/30
      "
      onClick={() => {
        onClick?.();
        handleViewVideo(video);
      }}
    >
      {/* Dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              toggleNewlyAdded();
            }}
            disabled={loading}
          >
            {newlyAddedId ? "Unmark Newly Added" : "Mark as Newly Added"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(video.id);
            }}
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CardContent className="p-0 flex flex-col">
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title ?? "Video Thumbnail"}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-3 flex flex-col gap-1 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium line-clamp-2">
              {video.title ?? "Untitled Video"}
            </h3>
            <Badge className={`text-xs px-2 py-0.5 rounded ${typeColors[video.type]}`}>
              {video.type.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground break-all">{video.url}</p>
        </div>
      </CardContent>
    </Card>
  );
}
