"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import { getNotesByTopicId, moveNoteToTrash } from "@/lib/api";
import type { Note } from "@/types/entities";
import NoteCard from "@/components/cards/NoteCard";

interface TopicNotesTabContentProps {
  notes: Note[] | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
  topicId: string;
  filterType: Note["type"] | "all";
}

const typeLabels: Record<Note["type"], string> = {
  mtp: "MTP",
  rtp: "RTP",
  other: "Other",
};

export default function TopicNotesTabContent({
  notes,
  setNotes,
  topicId,
  filterType,
}: TopicNotesTabContentProps) {
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const loadNotes = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await getNotesByTopicId(topicId);
      setNotes(res.data ?? []);
    } catch (e) {
      console.error(e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNote = (note: Note) => {
    const url = `${import.meta.env.VITE_SERVER_URL}${note.fileUrl}`;
    window.open(url, "_blank");
  };

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

    setNotes((prev) => prev?.filter((note) => note.id !== id) ?? null);
  };

  useEffect(() => {
    loadNotes();
  }, [topicId]);

  const filteredNotes =
    filterType === "all" ? notes ?? [] : (notes ?? []).filter((n) => n.type === filterType);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-72 rounded-lg" />
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        filterType === "all" ? (
          ["mtp", "rtp", "other"].map((type) => {
            const group = filteredNotes.filter((n) => n.type === type);
            if (group.length === 0) return null;
            return (
              <div key={type} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {typeLabels[type as Note["type"]]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={() => handleMoveToTrash(note.id)}
                      onClick={() => handleViewNote(note)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => handleMoveToTrash(note.id)}
                onClick={() => handleViewNote(note)}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-muted-foreground">No notes found for this topic.</p>
      )}
    </div>
  );
}
