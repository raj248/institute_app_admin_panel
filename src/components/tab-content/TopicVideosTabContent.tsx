"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/components/modals/global-confirm-dialog";
import { getVideoNotesByTopicId, moveVideoNoteToTrash } from "@/lib/api";
import type { VideoNote } from "@/types/entities";
import VideoCard from "@/components/cards/VideoCard";

interface TopicVideosTabContentProps {
  videos: VideoNote[] | null;
  setVideos: React.Dispatch<React.SetStateAction<VideoNote[] | null>>;
  topicId: string;
}

export default function TopicVideosTabContent({
  videos,
  setVideos,
  topicId,
}: TopicVideosTabContentProps) {
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  const fetchVideoDetails = async (videoNotes: VideoNote[]) => {
    if (!videoNotes || videoNotes.length === 0) return [];

    try {
      const updated = await Promise.all(
        videoNotes.map(async (video) => {
          if (!video.url.includes("youtube.com") && !video.url.includes("youtu.be")) {
            return {
              ...video,
              title: "Invalid YouTube URL",
              thumbnail: "https://via.placeholder.com/320x180?text=Invalid+URL",
            };
          }
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
            );
            if (!response.ok) throw new Error("Failed to fetch video data");
            const data = await response.json();
            return {
              ...video,
              title: data.title,
              thumbnail: data.thumbnail_url,
            };
          } catch {
            return {
              ...video,
              title: "Failed to fetch title",
              thumbnail: "https://via.placeholder.com/320x180?text=Error",
            };
          }
        })
      );
      return updated;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const loadVideos = async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await getVideoNotesByTopicId(topicId);
      const rawVideos = res.data ?? [];
      const enrichedVideos = await fetchVideoDetails(rawVideos);
      setVideos(enrichedVideos);
    } catch (e) {
      console.error(e);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVideo = (video: VideoNote) => {
    window.open(video.url, "_blank");
  };

  const handleMoveToTrash = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete This Video Note?",
      description: "This will move the video note to trash. You can restore it later if needed.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (!confirmed) return;

    const res = await moveVideoNoteToTrash(id);
    if (!res.success) {
      console.error("Failed to move video note to trash.");
      alert("Failed to move video note to trash.");
      return;
    }

    setVideos((prev) => prev?.filter((video) => video.id !== id) ?? null);
  };

  useEffect(() => {
    loadVideos();
  }, [topicId]);

  useEffect(() => {
    const unenriched = videos?.filter(v => !v.title || !v.thumbnail);
    if (!unenriched || unenriched.length === 0) return;

    fetchVideoDetails(unenriched).then((enriched) => {
      setVideos((prev) => {
        if (!prev) return enriched;
        // Merge enriched with existing
        return prev.map(v => {
          const enrichedVideo = enriched.find(e => e.id === v.id);
          return enrichedVideo ? enrichedVideo : v;
        });
      });
    });
  }, [videos]);



  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={() => handleMoveToTrash(video.id)}
              onClick={() => handleViewVideo(video)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No video notes found for this topic.</p>
      )}
    </div>
  );
}
