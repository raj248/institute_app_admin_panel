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
import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import axios from "axios";

const videoNoteSchema = z.object({
  videoUrl: z.url({ message: "Please enter a valid YouTube URL" }),
});

type VideoNoteSchema = z.infer<typeof videoNoteSchema>;

export function AddVideoNoteDialog({ onAdd }: { onAdd: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState<{
    title: string;
    description: string;
    thumbnail: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VideoNoteSchema>({
    resolver: zodResolver(videoNoteSchema),
  });

  const videoUrl = watch("videoUrl");

  useEffect(() => {
    const fetchPreview = async () => {
      if (!videoUrl || !videoUrl.includes("youtube.com")) {
        setVideoPreview(null);
        return;
      }
      try {
        const videoId = new URL(videoUrl).searchParams.get("v");
        if (!videoId) return;
        const response = await axios.get(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
        );
        setVideoPreview({
          title: response.data.title,
          description: response.data.description,
          thumbnail: response.data.thumbnail_url,
        });
      } catch {
        setVideoPreview(null);
      }
    };
    fetchPreview();
  }, [videoUrl]);

  const onSubmit = async (data: VideoNoteSchema) => {
    onAdd({ ...data, preview: videoPreview });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Video Note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Video Note</DialogTitle>
          <DialogDescription>Paste a YouTube link to add a video note with preview.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="videoUrl">YouTube Video URL</Label>
            <Input id="videoUrl" {...register("videoUrl")} placeholder="https://www.youtube.com/watch?v=..." />
            {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl.message}</p>}
          </div>

          {videoPreview && (
            <div className="flex flex-col items-center gap-2 border rounded-md p-2">
              <img src={videoPreview.thumbnail} alt="Thumbnail" className="w-full max-w-xs rounded" />
              <p className="font-medium text-center">{videoPreview.title}</p>
              <p className="text-sm text-gray-500 text-center line-clamp-3">{videoPreview.description}</p>
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
