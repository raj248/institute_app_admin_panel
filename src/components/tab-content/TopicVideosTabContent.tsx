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
  filterType: VideoNote["type"] | "all";
}

const typeLabels: Record<VideoNote["type"], string> = {
  mtp: "MTP",
  rtp: "RTP",
  revision: "Revision",
  other: "Other",
};

export default function TopicVideosTabContent({
  videos,
  setVideos,
  topicId,
  filterType,
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
        return prev.map(v => {
          const enrichedVideo = enriched.find(e => e.id === v.id);
          return enrichedVideo ? enrichedVideo : v;
        });
      });
    });
  }, [videos]);

  const filteredVideos =
    filterType === "all" ? videos ?? [] : (videos ?? []).filter((v) => v.type === filterType);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-72 rounded-lg" />
          ))}
        </div>
      ) : filteredVideos.length > 0 ? (
        filterType === "all" ? (
          ["mtp", "rtp", "revision", "other"].map((type) => {
            const group = filteredVideos.filter((v) => v.type === type);
            if (group.length === 0) return null;
            return (
              <div key={type} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {typeLabels[type as VideoNote["type"]]}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {group.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={() => handleMoveToTrash(video.id)}
                      onClick={() => handleViewVideo(video)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDelete={() => handleMoveToTrash(video.id)}
                onClick={() => handleViewVideo(video)}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-muted-foreground">No video notes found for this topic.</p>
      )}
    </div>
  );
}
