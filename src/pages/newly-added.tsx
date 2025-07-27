// app/pages/newly-added.tsx or /routes/NewlyAdded.tsx (depends on router setup)

"use client";

import { useEffect, useState } from "react";
import { getNewlyAddedItems, getNoteById, getTestPaperById, getVideoNoteById } from "@/lib/api";
import type { NewlyAdded, Note, TestPaper, VideoNote } from "@/types/entities";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import NoteCard from "@/components/cards/NoteCard";
import TestPaperCard from "@/components/cards/TestPaperCards";
import VideoCard from "@/components/cards/VideoCard";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

type LoadedNewItem =
  | { type: "Note"; expiry: string; newly: NewlyAdded; data: Note }
  | { type: "VideoNote"; expiry: string; newly: NewlyAdded; data: VideoNote }
  | { type: "TestPaper"; expiry: string; newly: NewlyAdded; data: TestPaper };


export default function NewlyAdded() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LoadedNewItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getNewlyAddedItems();
        if (!res.success || !res.data) return toast.error("Failed to fetch items");

        const promises = res.data.map(async (item) => {
          try {
            switch (item.tableName) {
              case "Note": {
                const r = await getNoteById(item.entityId);
                if (r.success && r.data) return { type: "Note", expiry: item.expiresAt, newly: item, data: r.data };
                break;
              }
              case "VideoNote": {
                const r = await getVideoNoteById(item.entityId);
                if (r.success && r.data) {
                  const video = r.data;

                  // Fetch YouTube details if valid URL
                  if (video.url.includes("youtube.com") || video.url.includes("youtu.be")) {
                    try {
                      const response = await fetch(
                        `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
                      );
                      if (response.ok) {
                        const data = await response.json();
                        video.title = data.title;
                        video.thumbnail = data.thumbnail_url;
                      } else {
                        video.title = "Failed to fetch title";
                        video.thumbnail = "https://via.placeholder.com/320x180?text=Error";
                      }
                    } catch {
                      video.title = "Failed to fetch title";
                      video.thumbnail = "https://via.placeholder.com/320x180?text=Error";
                    }
                  } else {
                    video.title = "Invalid YouTube URL";
                    video.thumbnail = "https://via.placeholder.com/320x180?text=Invalid+URL";
                  }

                  return { type: "VideoNote", expiry: item.expiresAt, newly: item, data: video };
                }
                break;
              }
              case "TestPaper": {
                const r = await getTestPaperById(item.entityId);
                if (r.success && r.data) return { type: "TestPaper", expiry: item.expiresAt, newly: item, data: r.data };
                break;
              }
            }
          } catch (e) {
            console.error(`Error fetching ${item.tableName} ${item.entityId}`, e);
          }
          return null;
        });

        const results = (await Promise.all(promises)).filter(Boolean) as LoadedNewItem[];
        setItems(results);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-xl font-semibold tracking-tight">Newly Added</h2>
      </div>

      {["Note", "TestPaper", "VideoNote"].map((type) => {
        const filtered = items.filter((item) => item.type === type);

        if (filtered.length === 0) return null;

        return (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-medium capitalize">{type}s</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
              {filtered.map((item) => {
                const { data, newly, expiry } = item;

                const onClick = () => {
                  switch (type) {
                    case "Note": navigate(`/notes/${data.id}`); break;
                    case "TestPaper": navigate(`/testpaper/${data.id}`); break;
                    case "VideoNote": navigate(`/videos/${data.id}`); break;
                  }
                };

                const expiryBadge = (
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires on: {format(new Date(expiry), "PPP")}
                  </p>
                );

                if (type === "Note") {
                  return (
                    <div key={newly.id}>
                      <NoteCard
                        note={{ ...data as Note, newlyAddedId: newly.id }}
                        onClick={onClick}
                        onDelete={() =>
                          setItems((prev) => prev.filter((i) => i.newly.id !== newly.id))
                        }
                      />
                      {expiryBadge}
                    </div>
                  );
                }

                if (type === "TestPaper") {
                  return (
                    <div key={newly.id}>
                      <TestPaperCard
                        paper={{ ...data as TestPaper, newlyAddedId: newly.id }}
                        topicId="-"
                        onClick={onClick}
                        onDelete={() =>
                          setItems((prev) => prev.filter((i) => i.newly.id !== newly.id))
                        }
                        refreshPapers={async () => { }}
                      />
                      {expiryBadge}
                    </div>
                  );
                }

                if (type === "VideoNote") {
                  return (
                    <div key={newly.id}>
                      <VideoCard
                        video={{ ...data as VideoNote, newlyAddedId: newly.id }}
                        onClick={onClick}
                        onDelete={() =>
                          setItems((prev) => prev.filter((i) => i.newly.id !== newly.id))
                        }
                      />
                      {expiryBadge}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

}
