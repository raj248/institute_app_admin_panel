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
import { addNewlyAddedItem, getNotesByTopicId, uploadNote } from "@/lib/api";
import { toast } from "sonner";
import type { Note } from "@/types/entities";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// ✅ Extend schema with type
const addNoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => file?.length === 1, "PDF file is required")
    .refine((file) => file?.[0]?.type === "application/pdf", "Only PDF files are allowed"),
  type: z.enum(["mtp", "rtp", "other"]),
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
  const [markAsNew, setMarkAsNew] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AddNoteSchema>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      type: "other",
    },
  });

  const onSubmit = async (data: AddNoteSchema) => {
    try {
      const result = await uploadNote({
        name: data.name,
        description: data.description,
        file: data.file[0],
        topicId,
        courseType,
        type: data.type,
      });

      if (result.success) {
        if (markAsNew && result.data) {
          await addNewlyAddedItem("Note", result.data.id);
        }
        toast.success("Note added successfully!");
        const refreshed = await getNotesByTopicId(topicId)
        setNotes(refreshed.data ?? null);
        setOpen(false);
        setMarkAsNew(false); // reset switch
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

      <DialogContent className="max-w-sm rounded-2xl p-4 sm:p-6">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-base font-semibold">Add New Note</DialogTitle>
          <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
            Fill details and upload a PDF to add new notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="text-sm w-24">
              Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              className="text-sm flex-1"
              placeholder="Enter note name"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 ml-24 -mt-2">{errors.name.message}</p>
          )}

          {/* Description */}
          <div className="flex items-start gap-2">
            <Label htmlFor="description" className="text-sm w-24 pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              className="text-sm flex-1 min-h-[80px]"
              placeholder="Short description (optional)"
            />
          </div>

          {/* Type */}
          <div className="flex items-center gap-2">
            <Label htmlFor="type" className="text-sm w-24">
              Type
            </Label>
            <Select
              defaultValue="other"
              onValueChange={(value) => setValue("type", value as "mtp" | "rtp" | "other")}
            >
              <SelectTrigger id="type" className="flex-1 text-sm">
                <SelectValue placeholder="Select Note Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtp">MTP</SelectItem>
                <SelectItem value="rtp">RTP</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.type && (
            <p className="text-xs text-red-500 ml-24 -mt-2">{errors.type.message}</p>
          )}

          {/* File */}
          <div className="flex items-center gap-2">
            <Label htmlFor="file" className="text-sm w-24">
              Upload PDF
            </Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              {...register("file")}
              className="text-sm flex-1"
            />
          </div>
          {errors.file && "message" in errors.file && typeof errors.file.message === "string" && (
            <p className="text-xs text-red-500 ml-24 -mt-2">{errors.file.message}</p>
          )}

          <div className="flex items-center gap-2">
            <Label htmlFor="markNew" className="w-28 text-xs">
              Mark as New
            </Label>
            <Switch id="markNew" checked={markAsNew} onCheckedChange={setMarkAsNew} />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" size="sm" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
