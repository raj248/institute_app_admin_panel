"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";
import { getNotesByTopicId, uploadNote } from "@/lib/api";
import { toast } from "sonner";
import type { Note } from "@/types/entities";

const addNoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => file?.length === 1, "PDF file is required")
    .refine((file) => file?.[0]?.type === "application/pdf", "Only PDF files are allowed"),
});

type AddNoteSchema = z.infer<typeof addNoteSchema>;

export function AddNotesDialog({
  topicId,
  courseType,
  setNotes,
}: {
  topicId: string;
  courseType: "CAInter" | "CAFinal";
  setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>,
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddNoteSchema>({
    resolver: zodResolver(addNoteSchema),
  });

  const onSubmit = async (data: AddNoteSchema) => {
    try {
      const result = await uploadNote({
        name: data.name,
        description: data.description,
        file: data.file[0],
        topicId,
        courseType,
      });

      if (result.success) {
        toast.success("Note added successfully!");
        const refreshed = await getNotesByTopicId(topicId)
        setNotes(refreshed.data ?? null);
        setOpen(false);
        reset();
      } else {
        toast.error(result.error ?? "Failed to add note.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus className="size-4" />
          <span className="hidden lg:inline">Add Note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>Fill details and upload a PDF to add new notes.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="file">Upload PDF</Label>
            <Input id="file" type="file" accept="application/pdf" {...register("file")} />
            {errors.file && "message" in errors.file && typeof errors.file.message === "string" && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
