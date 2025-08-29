"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideoByCourse } from "@/lib/api";
import type { VideoNote } from "@/types/entities";
import VideoCard from "@/components/cards/VideoCard";
import { useParams } from "react-router-dom";
import { AddVideoNoteDialog } from "@/components/modals/AddVideoNoteDialog";

interface TopicVideosTabContentProps {
  type?: "all" | "rtp" | "mtp" | "revision" | "other";
}

// const typeLabels: Record<VideoNote["type"], string> = {
//   mtp: "MTP",
//   rtp: "RTP",
//   revision: "Revision",
//   other: "Other",
// };

export default function VideoNotes({}: TopicVideosTabContentProps) {
  const { course, type } = useParams<{ course: string; type: string }>();

  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<VideoNote[] | null>(null);

  const fetchVideoDetails = async (videoNotes: VideoNote[]) => {
    if (!videoNotes || videoNotes.length === 0) return [];

    try {
      const updated = await Promise.all(
        videoNotes.map(async (video) => {
          if (
            !video.url.includes("youtube.com") &&
            !video.url.includes("youtu.be")
          ) {
            return {
              ...video,
              title: "Invalid YouTube URL",
              thumbnail: "https://via.placeholder.com/320x180?text=Invalid+URL",
            };
          }
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(
                video.url
              )}&format=json`
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

  useEffect(() => {
    loadVideos();
  }, [course, type]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      if (course === "CAInter" || course === "CAFinal") {
        const res = await getVideoByCourse(course, type as VideoNote["type"]);
        const rawVideos = res.data;
        if (!rawVideos) return;
        setVideos(rawVideos);
      }
    } catch (e) {
      console.error(e);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unenriched = videos?.filter((v) => !v.title || !v.thumbnail);
    if (!unenriched || unenriched.length === 0) return;

    fetchVideoDetails(unenriched).then((enriched) => {
      setVideos?.(
        (prev) =>
          prev?.map((v) => enriched.find((e) => e.id === v.id) ?? v) ?? null
      );
    });
  }, [videos]);

  //   const lowerFilter = globalFilter?.trim().toLowerCase();

  //   const filteredVideos = (videos ?? [])
  //     .filter((v) => filterType === "all" || v.type === filterType)
  //     .filter((v) => v.title?.toLowerCase().includes(lowerFilter));

  return (
    <div className="space-y-4">
      {/* Header row with add button */}
      <div className="flex justify-between items-center px-2 mt-3">
        <h2 className="text-base font-semibold text-muted-foreground">
          Video Notes
        </h2>
        <AddVideoNoteDialog
          topicId={""}
          courseType={course as "CAInter" | "CAFinal"}
          type={type as "all" | "rtp" | "mtp" | "revision" | "other"}
          setVideos={setVideos}
        />
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-72 rounded-lg" />
          ))}
        </div>
      ) : videos && videos?.length > 0 ? (
        ["mtp", "rtp", "revision", "other"].map((type) => {
          const group = videos.filter((v) => v.type === type);
          if (videos.length === 0) return null;
          return (
            <div key={type} className="space-y-2 mx-2">
              {/* <h3 className="text-sm font-semibold text-muted-foreground">
                {typeLabels[type as VideoNote["type"]]}
              </h3> */}
              <div className="flex flex-wrap my-4 gap-4">
                {group.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onDelete={() =>
                      setVideos(
                        (prev) => prev?.filter((v) => v.id !== video.id) ?? null
                      )
                    }
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-muted-foreground">
          No video notes found for this topic.
        </p>
      )}
    </div>
  );
}
