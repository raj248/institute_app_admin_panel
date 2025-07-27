"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VideoNote } from "@/types/entities";
import { Button } from "../ui/button";
import { Trash2, PlusCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
import { addNewlyAddedItem, moveVideoNoteToTrash, removeNewlyAddedItem } from "@/lib/api";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";

interface VideoCardProps {
  video: VideoNote;
  onDelete?: () => void;
  onClick: () => void;
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
      alert("Failed to move video note to trash.");
      return;
    }
    onDelete?.();
  };
  const toggleNewlyAdded = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
        rounded-xl overflow-hidden shadow-sm hover:shadow-md
        transition-transform duration-150 cursor-pointer
      "
      onClick={onClick}
    >
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

        {/* Action Buttons Slide Up on Hover */}
        <div
          className="
            absolute bottom-0 left-0 w-full
            bg-background/80
            flex justify-center gap-2 p-2
            translate-y-full opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-200 ease-in-out
            rounded-b-xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant={newlyAddedId ? "secondary" : "outline"}
            disabled={loading}
            onClick={toggleNewlyAdded}
          >
            {newlyAddedId ? (
              <>
                <MinusCircle size={16} className="mr-1" />
                <span className="hidden lg:inline">Unmark</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} className="mr-1" />
                <span className="hidden lg:inline">Mark</span>
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            aria-label="Delete"
            onClick={() => {
              handleMoveToTrash(video.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
