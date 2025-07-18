import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/global-confirm-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
}

interface Props {
  videoLinks: string[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newUrl: string) => void;
}

export default function YouTubeVideoGridTab({ videoLinks, onDelete, onEdit }: Props) {
  const [videos, setVideos] = useState<YouTubeVideo[] | null>(null);
  const confirm = useConfirm();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const videoData: YouTubeVideo[] = [];
      for (const url of videoLinks) {
        try {
          const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
          const res = await fetch(oEmbedUrl);
          if (!res.ok) throw new Error("Failed to fetch video data");
          const data = await res.json();
          videoData.push({
            id: url, // use URL as ID for simplicity
            url,
            title: data.title,
            thumbnail: data.thumbnail_url,
          });
        } catch {
          videoData.push({
            id: url,
            url,
            title: "Failed to fetch title",
            thumbnail: "https://via.placeholder.com/320x180?text=Error",
          });
        }
      }
      setVideos(videoData);
    };

    fetchVideoDetails();
  }, [videoLinks]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this video?",
      description: "This will remove the video from your list. You cannot undo this action.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    onDelete(id);
    setVideos((prev) => prev?.filter((video) => video.id !== id) ?? null);
    toast.success("Video deleted.");
  };

  const handleEdit = (id: string, newUrl: string) => {
    onEdit(id, newUrl);
    toast.success("Video updated.");
  };

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] p-4">
      {videos === null
        ? Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[200px] w-full rounded-lg" />
        ))
        : videos.map((video) => (
          <Card key={video.id} className="relative group overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full aspect-video object-cover rounded-t-lg"
            />
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium truncate">
                {video.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center px-2 pb-2">
              {/* Edit Drawer */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition">
                    <Pencil size={16} />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Edit Video URL</DrawerTitle>
                    <DrawerDescription>Update the YouTube video link.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const newUrl = formData.get("url") as string;
                        handleEdit(video.id, newUrl);
                      }}
                      className="space-y-4"
                    >
                      <Input
                        name="url"
                        defaultValue={video.url}
                        placeholder="Enter new YouTube URL"
                      />
                      <DrawerFooter>
                        <Button type="submit">Save</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </form>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Delete */}
              <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDelete(video.id)}
              >
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
