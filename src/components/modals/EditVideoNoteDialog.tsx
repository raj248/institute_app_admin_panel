"use client";

import { Controller, useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { updateVideoNote } from "@/lib/api";
import type { VideoNote } from "@/types/entities";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PenIcon } from "lucide-react";

// Reuse the same schema
const editVideoNoteSchema = z.object({
  url: z.url("Please enter a valid YouTube URL"),
  type: z.enum(["mtp", "rtp", "revision", "other"]),
});

type EditVideoNoteSchema = z.infer<typeof editVideoNoteSchema>;

export function EditVideoNoteDialog({
  note,
  topicId,
  onRefresh,
  trigger,
}: {
  note: VideoNote;
  topicId?: string;
  onRefresh?: () => Promise<void>;
  trigger?: (props: { open: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<{
    title: string;
    thumbnail: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditVideoNoteSchema>({
    resolver: zodResolver(editVideoNoteSchema),
    defaultValues: {
      url: note.url,
      type: note.type,
    },
  });

  const url = watch("url");

  // Fetch preview if URL changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
        setPreview(null);
        return;
      }
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            url
          )}&format=json`
        );
        const data = await response.json();
        setPreview({ title: data.title, thumbnail: data.thumbnail_url });
      } catch {
        setPreview(null);
      }
    };
    fetchPreview();
  }, [url]);

  const onSubmit = async (data: EditVideoNoteSchema) => {
    try {
      const result = await updateVideoNote(note.id, {
        url: data.url,
        name: preview?.title || note.name,
        type: data.type,
        courseType: note.courseType as "CAInter" | "CAFinal",
      });

      if (result.success) {
        toast.success("Video note updated successfully!");
        if (!topicId) {
          // Optional: refresh by courseType + type
          //   const refreshed = await getVideoByCourse(
          //     result.data?.courseType as "CAInter" | "CAFinal",
          //     data.type
          //   );
          onRefresh?.();

          setOpen(false);
          reset();
          return;
        }
        setOpen(false);
        reset();
      } else {
        toast.error(result.error ?? "Failed to update video note.");
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
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <PenIcon className="mr-2 size-4" />
          <span>Edit</span>
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <IconEdit className="size-4" />
            <span className="hidden lg:inline">Edit</span>
          </Button>
        </DialogTrigger> */}

        <DialogContent className="max-w-md rounded-2xl p-4 sm:p-6">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-base font-semibold tracking-tight">
              Edit Video Note
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify the URL or type of your video note.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* URL */}
            <div className="flex items-center gap-2">
              <Label htmlFor="url" className="w-28 text-xs">
                YouTube URL
              </Label>
              <Input
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register("url")}
                className="flex-1 text-sm"
              />
            </div>
            {errors.url && (
              <p className="text-xs text-red-500 pl-28 -mt-1">
                {errors.url.message}
              </p>
            )}

            {/* Type */}
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Label htmlFor="type" className="w-28 text-xs">
                    Video Type
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="type" className="flex-1 text-sm">
                      <SelectValue placeholder="Select Video Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtp">MTP</SelectItem>
                      <SelectItem value="rtp">RTP</SelectItem>
                      <SelectItem value="revision">Revision</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500 pl-28 -mt-1">
                {errors.type.message}
              </p>
            )}

            {/* Preview */}
            {preview && (
              <div className="flex flex-col items-center gap-2 border border-muted rounded-lg p-2 mt-2">
                <img
                  src={preview.thumbnail}
                  alt="Thumbnail"
                  className="w-full max-w-xs rounded-md shadow-sm"
                />
                <p className="font-medium text-sm text-center px-2">
                  {preview.title}
                </p>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-sm py-2 rounded-xl"
              >
                {isSubmitting ? "Updating..." : "Update Video Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
