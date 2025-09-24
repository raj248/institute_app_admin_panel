"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNotes, getNotesByCourseType } from "@/lib/api";
import type { Note } from "@/types/entities";
import NoteCard from "@/components/cards/NoteCard";
import { useParams } from "react-router-dom";
import { AddNotesDialog } from "@/components/modals/AddNotesDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NotesPageProps {}

export default function Notes({}: NotesPageProps) {
  const { course } = useParams<{ course: string }>();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[] | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const pageSize = 12; // 👈 adjust how many notes per page

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

  // paginate flat notes list
  const paginatedNotes = notes?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {/* Header row with add button */}
      <div className="flex justify-between items-center px-2 mt-3">
        <h2 className="text-base font-semibold text-muted-foreground">Notes</h2>
        {course && <AddNotesDialog setNotes={setNotes} />}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-72 rounded-lg" />
          ))}
        </div>
      ) : paginatedNotes && paginatedNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2">
          {paginatedNotes.map((note) => (
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
      ) : (
        <p className="text-center text-muted-foreground">No notes found.</p>
      )}

      {/* Pagination controls */}
      {notes && notes.length > pageSize && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2">
                Page {page} of {Math.ceil(notes.length / pageSize)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((p) =>
                    Math.min(Math.ceil(notes.length / pageSize), p + 1)
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
