"use client";

import { Controller, useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  addNewlyAddedItem,
  addVideoNote,
  getVideoByCourse,
  getVideoNotesByTopicId,
} from "@/lib/api";
import type { VideoNote } from "@/types/entities";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// ✅ Extend schema to include type
const addVideoNoteSchema = z.object({
  url: z.url("Please enter a valid YouTube URL"),
  type: z.enum(["mtp", "rtp", "revision", "other"]),
});

type AddVideoNoteSchema = z.infer<typeof addVideoNoteSchema>;

export function AddVideoNoteDialog({
  topicId,
  courseType,
  type,
  setVideos,
}: {
  topicId?: string;
  courseType: "CAInter" | "CAFinal";
  type?: "all" | "rtp" | "mtp" | "revision" | "other";
  setVideos: React.Dispatch<React.SetStateAction<VideoNote[] | null>>;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<{
    title: string;
    thumbnail: string;
  } | null>(null);

  const [markAsNew, setMarkAsNew] = useState(false);
  const [notify, setNotify] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<AddVideoNoteSchema>({
    resolver: zodResolver(addVideoNoteSchema),
  });

  const url = watch("url");

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
        setPreview({
          title: data.title,
          thumbnail: data.thumbnail_url,
        });
      } catch {
        setPreview(null);
      }
    };
    fetchPreview();
  }, [url]);

  const onSubmit = async (data: AddVideoNoteSchema) => {
    try {
      const result = await addVideoNote({
        url: data.url,
        name: preview?.title || "",
        topicId: topicId || null,
        courseType,
        type: data.type,
        notify,
      });

      if (result.success) {
        if (markAsNew && result.data) {
          await addNewlyAddedItem("VideoNote", result.data.id);
        }

        toast.success("Video note added successfully!");
        if (!topicId) {
          const refreshed = await getVideoByCourse(courseType, data.type);
          if (data.type === type) setVideos(refreshed.data ?? null);
          setOpen(false);
          reset();
          setMarkAsNew(false); // reset switch
          return;
        }
        const refreshed = await getVideoNotesByTopicId(topicId);
        setVideos(refreshed.data ?? null);
        setOpen(false);
        reset();
        setMarkAsNew(false); // reset switch
      } else {
        toast.error(result.error ?? "Failed to add video note.");
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
          <span className="hidden lg:inline">Add Video Note</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Add Video Note
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Paste a YouTube URL and select type to add it as a video note with
            preview.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* YouTube URL */}
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

          {/* Video Type */}
          <Controller
            name="type"
            control={control}
            // defaultValue={topicId ? "revision" : (type as VideoNote["type"])} // 👈 default depending on topicId
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Label htmlFor="type" className="w-28 text-xs">
                  Video Type
                </Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange} // react-hook-form tracking
                >
                  <SelectTrigger id="type" className="flex-1 text-sm">
                    <SelectValue placeholder="Select Video Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicId ? (
                      <>
                        <SelectItem value="revision">Revision</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="mtp">MTP</SelectItem>
                        <SelectItem value="rtp">RTP</SelectItem>
                      </>
                    )}
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

          <div className="flex items-center gap-2">
            <Label htmlFor="markNew" className="w-28 text-xs">
              Mark as New?
            </Label>
            <Switch
              id="markNew"
              checked={markAsNew}
              onCheckedChange={setMarkAsNew}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="notify" className="w-28 text-xs">
              Send Notification?
            </Label>
            <Switch id="notify" checked={notify} onCheckedChange={setNotify} />
          </div>

          {/* Submit */}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-sm py-2 rounded-xl"
            >
              {isSubmitting ? "Adding..." : "Add Video Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
