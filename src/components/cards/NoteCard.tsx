"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import type { Note } from "@/types/entities";
import { format } from "date-fns";

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
  onClick: () => void;
}

export default function NoteCard({ note, onDelete, onClick }: NoteCardProps) {
  return (
    <Card className="hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base line-clamp-1">{note.name}</CardTitle>
        {note.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {note.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {note.createdAt ? format(new Date(note.createdAt), "dd MMM yyyy") : ""}
        </div>
        <div className="flex gap-2">
          <Button className="cursor-pointer" size="icon" variant="secondary" onClick={onClick}>
            <Eye size={16} />
          </Button>
          <Button className="cursor-pointer" size="icon" variant="destructive" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
