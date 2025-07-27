"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideoNotesByTopicId } from "@/lib/api";
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
    if (!topicId || videos !== null) return;
    try {
      const res = await getVideoNotesByTopicId(topicId);
      const rawVideos = res.data ?? [];
      setVideos(rawVideos); // show immediately
      setLoading(false);
    } catch (e) {
      console.error(e);
      setVideos([]);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [topicId]);

  useEffect(() => {
    const unenriched = videos?.filter((v) => !v.title || !v.thumbnail);
    if (!unenriched || unenriched.length === 0) return;

    fetchVideoDetails(unenriched).then((enriched) => {
      setVideos((prev) =>
        prev?.map((v) => enriched.find((e) => e.id === v.id) ?? v) ?? null
      );
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
              <div key={type} className="space-y-2 mx-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {typeLabels[type as VideoNote["type"]]}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {group.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={() => setVideos((prev) => prev?.filter((v) => v.id !== video.id) ?? null)}
                      onClick={() => { }}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-wrap gap-4  mx-2">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDelete={() => setVideos((prev) => prev?.filter((v) => v.id !== video.id) ?? null)}
                onClick={() => { }}
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
