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

const addNoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => file?.length === 1, "PDF file is required")
    .refine((file) => file?.[0]?.type === "application/pdf", "Only PDF files are allowed"),
});

type AddNoteSchema = z.infer<typeof addNoteSchema>;

export function AddNotesDialog({ onAdd }: { onAdd: (data: any) => void }) {
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
    const noteData = {
      name: data.name,
      description: data.description,
      file: data.file[0],
    };
    onAdd(noteData);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
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
