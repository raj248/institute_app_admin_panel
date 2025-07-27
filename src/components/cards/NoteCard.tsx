"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, PlusCircle, MinusCircle } from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@/types/entities";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { addNewlyAddedItem, moveNoteToTrash, removeNewlyAddedItem } from "@/lib/api";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";

interface NoteCardProps {
  note: Note;
  onDelete?: () => void;
  onClick: () => void;
}


export default function NoteCard({ note, onDelete, onClick }: NoteCardProps) {
  const typeColors: Record<Note["type"], string> = {
    mtp: "bg-blue-100 text-blue-800",
    rtp: "bg-green-100 text-green-800",
    other: "bg-gray-100 text-gray-800",
  };
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(note.newlyAddedId);
  const confirm = useConfirm();

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Note?",
      description: "This will move the note to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const res = await moveNoteToTrash(id);
    if (!res.success) {
      console.error("Failed to move note to trash.");
      alert("Failed to move note to trash.");
      return;
    }
    onDelete?.();
  };

  const toggleNewlyAdded = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (!newlyAddedId) {
        const res = await addNewlyAddedItem("Note", note.id);
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
    } catch (e) {
      console.error(e);
      toast.error("Failed to toggle newly added");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      key={note.id}
      className="
        relative group
        hover:scale-[1.02] transition-transform hover:shadow-md
        rounded-xl border border-border/40 cursor-pointer
        overflow-hidden
      "
      onClick={onClick}
    >
      <CardContent className="space-y-1 pb-4">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium line-clamp-2">{note.name ?? "Untitled Note"}</h3>
            <Badge
              className={`text-xs px-2 py-0.5 rounded ${typeColors[note.type]}`}
            >
              {note.type.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground break-all">
            {note.description ?? <em>No description</em>}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            {format(new Date(note.createdAt), "dd MMM yyyy")}
          </div>
        </div>
      </CardContent>

      {isMobile ? (
        <CardFooter
          className="flex items-center justify-between px-4 pb-4"
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
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(note.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </CardFooter>
      ) : (
        <div
          className="
            absolute bottom-0 left-0 w-full
            bg-background/80
            flex justify-between items-center gap-2 p-2
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
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToTrash(note.id);
            }}
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
