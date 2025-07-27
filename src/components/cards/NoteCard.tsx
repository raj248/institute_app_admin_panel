"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@/types/entities";
import { useState } from "react";
import { addNewlyAddedItem, moveNoteToTrash, removeNewlyAddedItem } from "@/lib/api";
import { toast } from "sonner";
import { useConfirm } from "../modals/global-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function NoteCard({ note, onDelete, onClick }: NoteCardProps) {
  const typeColors: Record<Note["type"], string> = {
    mtp: "bg-blue-100 text-blue-800",
    rtp: "bg-green-100 text-green-800",
    other: "bg-gray-100 text-gray-800",
  };
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

  const handleViewNote = (note: Note) => {
    const url = `${import.meta.env.VITE_SERVER_URL}${note.fileUrl}`;
    window.open(url, "_blank");
  };

  const toggleNewlyAdded = async () => {
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
      className="relative transition hover:shadow-md hover:shadow-primary/40 border rounded-xl mx-2 sm:mx-4 max-w-xs min-w-[220px] flex-1 group bg-background hover:bg-accent/30"
    >
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
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
              handleMoveToTrash(note.id);
            }}
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clickable Card Area */}
      <div onClick={() => { onClick?.(); handleViewNote(note) }} className="cursor-pointer flex flex-col h-full justify-between p-4">
        <div className="space-y-1 text-center">
          <CardTitle className="text-sm font-semibold text-foreground">
            {note.name ?? "Untitled Note"}
          </CardTitle>
          <CardContent className="text-xs text-muted-foreground">
            {note.description ?? <em>No description</em>}
          </CardContent>
        </div>

        <div className="mt-3 flex justify-center">
          <Badge className={`text-[10px] rounded-full px-2 py-0.5 ${typeColors[note.type]}`}>
            {note.type.toUpperCase()}
          </Badge>
        </div>

        <div className="mt-2 flex justify-center gap-1 text-xs text-muted-foreground">
          <Calendar size={14} />
          {format(new Date(note.createdAt), "dd MMM yyyy")}
        </div>
      </div>
    </Card>

  );
}
