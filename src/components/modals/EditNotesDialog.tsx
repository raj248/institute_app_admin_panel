"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import type { Note } from "@/types/entities";
import { updateNote, addNewlyAddedItem } from "@/lib/api";

const editNoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  courseType: z.enum(["CAInter", "CAFinal"]),
  type: z.enum(["mtp", "rtp", "other"]),
});

type EditNoteSchema = z.infer<typeof editNoteSchema>;

export function EditNoteDialog({
  note,
  refreshNotes,
  trigger,
}: {
  note: Note;
  refreshNotes?: () => Promise<void>;
  trigger?: (props: { open: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [markAsNew, setMarkAsNew] = useState(false);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<EditNoteSchema>({
    resolver: zodResolver(editNoteSchema),
    defaultValues: {
      name: note.name,
      description: note.description,
      courseType: note.courseType,
      type: note.type,
    },
  });

  const onSubmit = async (data: EditNoteSchema) => {
    try {
      const result = await updateNote(
        note.id,
        {
          ...data,
        },
        newPdfFile ?? undefined
      );

      if (result.success) {
        if (markAsNew && result.data) {
          await addNewlyAddedItem("Note", result.data.id, true);
        }
        toast.success("Note updated successfully!");
        refreshNotes?.();
        setOpen(false);
        setMarkAsNew(false);
        reset();
      } else {
        toast.error(result.error ?? "Failed to update note.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      {trigger ? (
        trigger({ open: () => setOpen(true) })
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Edit Note
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-4 sm:p-6">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-base font-semibold">
              Edit Note
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Modify the details of your note.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
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
              <p className="text-xs text-red-500 ml-24 -mt-2">
                {errors.name.message}
              </p>
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
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label htmlFor="type" className="text-sm w-24">
                    Type
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500 ml-24 -mt-2">
                {errors.type.message}
              </p>
            )}

            {/* Course Type */}
            <Controller
              name="courseType"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label htmlFor="courseType" className="text-sm w-24">
                    Course Type
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="courseType" className="flex-1 text-sm">
                      <SelectValue placeholder="Select Course Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAInter">CA Inter</SelectItem>
                      <SelectItem value="CAFinal">CA Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.courseType && (
              <p className="text-xs text-red-500 ml-24 -mt-2">
                {errors.courseType.message}
              </p>
            )}

            {/* Mark as New */}
            <div className="flex items-center gap-2">
              <Label htmlFor="markNew" className="w-28 text-xs">
                Mark as New
              </Label>
              <Switch
                id="markNew"
                checked={markAsNew}
                onCheckedChange={setMarkAsNew}
              />
            </div>

            {/* File */}
            <div className="flex items-center gap-2">
              <Label htmlFor="file" className="text-sm w-24">
                Upload PDF
              </Label>
              <Input
                id="file"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  // Handle file upload logic here
                  // You might want to use a state to store the new file
                  // and then send it with the updateTestPaper call
                  setNewPdfFile(e.target.files?.[0] ?? null);
                  console.log(e.target.files?.[0]);
                }}
                className="text-sm flex-1"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Updating..." : "Update Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
