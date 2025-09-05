// a saperate page that will take params for the coursetype then will show all the notes for that course
"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNotes, getNotesByCourseType } from "@/lib/api";
import type { Note } from "@/types/entities";
import NoteCard from "@/components/cards/NoteCard";
import { useParams } from "react-router-dom";
import { AddNotesDialog } from "@/components/modals/AddNotesDialog";

interface NotesPageProps {}

const typeLabels: Record<Note["type"], string> = {
  mtp: "MTP",
  rtp: "RTP",
  other: "Other",
};

export default function Notes({}: NotesPageProps) {
  const { course } = useParams<{ course: string }>();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    loadNotes();
  }, [course]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      if (course === "CAInter" || course === "CAFinal") {
        const res = await getNotesByCourseType(course);
        if (!res.data) return;
        setNotes(res.data);
      } else {
        const res = await getAllNotes();
        if (!res.data) return;
        setNotes(res.data);
      }
    } catch (e) {
      console.error(e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header row with add button */}
      <div className="flex justify-between items-center px-2 mt-3">
        <h2 className="text-base font-semibold text-muted-foreground">Notes</h2>
        {course && (
          <AddNotesDialog
            topicId={""} // Not associated with a specific topic on this page
            courseType={course as "CAInter" | "CAFinal"}
            setNotes={setNotes}
          />
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-72 rounded-lg" />
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        ["mtp", "rtp", "other"].map((type) => {
          const group = notes.filter((n) => n.type === type);
          if (group.length === 0) return null;
          return (
            <div key={type} className="space-y-2 mx-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {typeLabels[type as Note["type"]]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={() =>
                      setNotes(
                        (prev) => prev?.filter((n) => n.id !== note.id) ?? null
                      )
                    }
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-muted-foreground">No notes found.</p>
      )}
    </div>
  );
}
