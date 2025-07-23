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
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { addVideoNote, getVideoNotesByTopicId } from "@/lib/api";
import type { VideoNote } from "@/types/entities";

const addVideoNoteSchema = z.object({
  url: z.url("Please enter a valid YouTube URL"),
});

type AddVideoNoteSchema = z.infer<typeof addVideoNoteSchema>;

export function AddVideoNoteDialog({
  topicId,
  courseType,
  setVideos,
}: {
  topicId: string;
  courseType: "CAInter" | "CAFinal";
  setVideos: React.Dispatch<React.SetStateAction<VideoNote[] | null>>;
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
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddVideoNoteSchema>({
    resolver: zodResolver(addVideoNoteSchema),
  });

  const url = watch("url");

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
        setPreview(null);
        return;
      }
      try {
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
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
        topicId,
        courseType,
      });

      if (result.success) {
        toast.success("Video note added successfully!");
        const refreshed = await getVideoNotesByTopicId(topicId);
        setVideos(refreshed.data ?? null);
        setOpen(false);
        reset();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Video Note</DialogTitle>
          <DialogDescription>Paste a YouTube URL to add it as a video note with preview.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="url">YouTube URL</Label>
            <Input id="url" placeholder="https://www.youtube.com/watch?v=..." {...register("url")} />
            {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
          </div>

          {preview && (
            <div className="flex flex-col items-center gap-2 border rounded p-2">
              <img src={preview.thumbnail} alt="Thumbnail" className="w-full max-w-xs rounded" />
              <p className="font-medium text-center">{preview.title}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Video Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
